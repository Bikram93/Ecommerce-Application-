from rest_framework import generics, permissions, status, viewsets, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.db.models import Sum, Count, Q
from django.shortcuts import get_object_or_404
import uuid

from .models import (
    User, Profile, Address, Category, Product, ProductImage,
    Review, Cart, CartItem, Wishlist, WishlistItem, Order,
    OrderItem, Payment
)
from .serializers import (
    UserSerializer, RegisterSerializer, ProfileSerializer,
    AddressSerializer, ChangePasswordSerializer, CategorySerializer,
    ProductListSerializer, ProductDetailSerializer, CartSerializer,
    WishlistSerializer, OrderSerializer, CreateOrderSerializer,
    PaymentSerializer
)

# ---------------------------------------------------------------------
# 1. AUTHENTICATION & USER PROFILE VIEWS
# ---------------------------------------------------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'is_staff': self.user.is_staff,
        }
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        profile = user.profile

        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.save()

        profile_serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if profile_serializer.is_valid():
            profile_serializer.save()
            return Response(UserSerializer(user).data)
        return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by('-is_default', '-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password updated successfully!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'message': f'For demo showcase: A password reset link has been simulated for {email}.'
        }, status=status.HTTP_200_OK)

# ---------------------------------------------------------------------
# 2. CATEGORIES & PRODUCTS VIEWS (Search, Filter, Sort)
# ---------------------------------------------------------------------
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'sku']
    ordering_fields = ['price', 'rating', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category')
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        featured = self.request.query_params.get('featured')
        if featured in ['true', '1']:
            queryset = queryset.filter(is_featured=True)

        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Product.objects.filter(is_active=True).prefetch_related('images', 'reviews', 'reviews__user')

class ReviewCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        rating = int(request.data.get('rating', 5))
        comment = request.data.get('comment', '').strip()

        if not comment:
            return Response({'error': 'Comment is required'}, status=status.HTTP_400_BAD_REQUEST)

        review = Review.objects.create(
            product=product,
            user=request.user,
            rating=rating,
            comment=comment
        )

        # Update product average rating
        reviews = product.reviews.all()
        product.reviews_count = reviews.count()
        product.rating = sum(r.rating for r in reviews) / product.reviews_count
        product.save()

        return Response({
            'id': review.id,
            'user_name': f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username,
            'rating': review.rating,
            'comment': review.comment,
            'created_at': review.created_at
        }, status=status.HTTP_201_CREATED)

# ---------------------------------------------------------------------
# 3. SHOPPING CART VIEWS
# ---------------------------------------------------------------------
class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class CartItemAddView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        if quantity < 1:
            return Response({'error': 'Quantity must be at least 1'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id, is_active=True)
        if product.stock < quantity:
            return Response({'error': f'Only {product.stock} items available in stock'}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            if product.stock < (cart_item.quantity + quantity):
                return Response({'error': f'Cannot exceed available stock of {product.stock}'}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity += quantity
            cart_item.save()
        else:
            cart_item.quantity = quantity
            cart_item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

class CartItemUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, item_id):
        quantity = int(request.data.get('quantity', 1))
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)

        if quantity < 1:
            cart_item.delete()
        else:
            if cart_item.product.stock < quantity:
                return Response({'error': f'Only {cart_item.product.stock} available in stock'}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = quantity
            cart_item.save()

        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        return Response(CartSerializer(cart).data)

class CartClearView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data)

# ---------------------------------------------------------------------
# 4. WISHLIST VIEWS
# ---------------------------------------------------------------------
class WishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)

class WishlistToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        item = WishlistItem.objects.filter(wishlist=wishlist, product=product).first()

        if item:
            item.delete()
            return Response({'message': 'Removed from wishlist', 'in_wishlist': False})
        else:
            WishlistItem.objects.create(wishlist=wishlist, product=product)
            return Response({'message': 'Added to wishlist', 'in_wishlist': True})

# ---------------------------------------------------------------------
# 5. CHECKOUT & ORDERS VIEWS
# ---------------------------------------------------------------------
class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        cart = get_object_or_404(Cart, user=request.user)
        cart_items = cart.items.select_related('product').all()

        if not cart_items.exists():
            return Response({'error': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Resolve Shipping Address snapshot
        address_id = serializer.validated_data.get('address_id')
        if address_id:
            addr = get_object_or_404(Address, id=address_id, user=request.user)
            shipping_address_data = {
                'full_name': addr.full_name,
                'phone': addr.phone,
                'street_address': addr.street_address,
                'city': addr.city,
                'state': addr.state,
                'postal_code': addr.postal_code,
                'country': addr.country,
            }
        else:
            shipping_address_data = serializer.validated_data['shipping_address']

        # 2. Check stock and compute subtotal
        subtotal = 0
        for item in cart_items:
            if item.product.stock < item.quantity:
                return Response({
                    'error': f"Insufficient stock for {item.product.title}. Only {item.product.stock} available."
                }, status=status.HTTP_400_BAD_REQUEST)
            item_price = item.product.discount_price if item.product.discount_price else item.product.price
            subtotal += (item_price * item.quantity)

        shipping_fee = 0.00 if subtotal > 100 else 10.00
        tax = round(float(subtotal) * 0.08, 2)
        total_amount = float(subtotal) + shipping_fee + tax

        payment_method = serializer.validated_data['payment_method']
        payment_status = 'PAID' if payment_method != 'COD' else 'UNPAID'

        # 3. Create Order
        order = Order.objects.create(
            user=request.user,
            shipping_address_json=shipping_address_data,
            subtotal=subtotal,
            shipping_fee=shipping_fee,
            tax=tax,
            total_amount=total_amount,
            status='PROCESSING' if payment_method != 'COD' else 'PENDING',
            payment_status=payment_status,
            payment_method=payment_method,
            notes=serializer.validated_data.get('notes', '')
        )

        # 4. Create OrderItems & Decrement Stock
        for item in cart_items:
            item_price = item.product.discount_price if item.product.discount_price else item.product.price
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_title=item.product.title,
                product_image=item.product.thumbnail_url,
                price=item_price,
                quantity=item.quantity,
                subtotal=item_price * item.quantity
            )
            # Deduct stock
            item.product.stock -= item.quantity
            item.product.save()

        # 5. Create Payment record
        Payment.objects.create(
            order=order,
            transaction_id=f"TXN-{uuid.uuid4().hex[:12].upper()}",
            payment_method=payment_method,
            amount=total_amount,
            status='SUCCESS' if payment_method != 'COD' else 'PENDING',
            response_payload={'simulated': True, 'method': payment_method}
        )

        # 6. Clear user cart
        cart_items.delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class OrderHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items').order_by('-created_at')

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'order_number'

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().prefetch_related('items')
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

# ---------------------------------------------------------------------
# 6. ADMIN DASHBOARD & STORE MANAGEMENT
# ---------------------------------------------------------------------
class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_revenue = Order.objects.exclude(status='CANCELLED').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_orders = Order.objects.count()
        total_products = Product.objects.count()
        total_users = User.objects.filter(is_staff=False).count()
        low_stock_products = Product.objects.filter(stock__lte=5, is_active=True).values('id', 'title', 'stock', 'price')
        recent_orders = OrderSerializer(Order.objects.order_by('-created_at')[:5], many=True).data

        # Order status breakdown
        status_counts = Order.objects.values('status').annotate(count=Count('status'))

        return Response({
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'total_products': total_products,
            'total_users': total_users,
            'low_stock_products': low_stock_products,
            'recent_orders': recent_orders,
            'status_breakdown': status_counts
        })

class AdminOrderUpdateStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        new_status = request.data.get('status')
        new_payment_status = request.data.get('payment_status')

        if new_status and new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
        if new_payment_status and new_payment_status in dict(Order.PAYMENT_STATUS_CHOICES):
            order.payment_status = new_payment_status

        order.save()
        return Response(OrderSerializer(order).data)
