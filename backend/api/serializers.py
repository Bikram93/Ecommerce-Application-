from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import (
    User,
    Profile,
    Address,
    Category,
    Product,
    ProductImage,
    Review,
    Cart,
    CartItem,
    Wishlist,
    WishlistItem,
    Order,
    OrderItem,
    Payment
)

# ---------------------------------------------------------------------
# 1. USER & AUTH SERIALIZERS
# ---------------------------------------------------------------------
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'phone_number', 'avatar_url', 'bio', 'created_at', 'updated_at']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            'id', 'full_name', 'phone', 'street_address',
            'city', 'state', 'postal_code', 'country',
            'is_default', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    addresses = AddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'is_staff', 'profile', 'addresses']
        read_only_fields = ['id', 'is_staff']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        username = validated_data.get('username') or validated_data['email'].split('@')[0]
        user = User.objects.create_user(
            email=validated_data['email'],
            username=username,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

# ---------------------------------------------------------------------
# 2. CATALOG & PRODUCT SERIALIZERS
# ---------------------------------------------------------------------
class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image_url', 'is_active', 'products_count']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text', 'is_primary']

class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user_email', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']

    def get_user_name(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.user.username

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'description', 'price',
            'discount_price', 'stock', 'sku', 'rating',
            'reviews_count', 'thumbnail_url', 'is_featured',
            'is_active', 'category', 'category_name', 'category_slug'
        ]

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'description', 'price',
            'discount_price', 'stock', 'sku', 'rating',
            'reviews_count', 'thumbnail_url', 'is_featured',
            'is_active', 'category', 'images', 'reviews',
            'created_at', 'updated_at'
        ]

# ---------------------------------------------------------------------
# 3. CART SERIALIZERS
# ---------------------------------------------------------------------
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'subtotal', 'updated_at']

# ---------------------------------------------------------------------
# 4. WISHLIST SERIALIZERS
# ---------------------------------------------------------------------
class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_id', 'created_at']

class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'items', 'created_at']

# ---------------------------------------------------------------------
# 5. ORDER & CHECKOUT SERIALIZERS
# ---------------------------------------------------------------------
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_title', 'product_image',
            'price', 'quantity', 'subtotal'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user_email', 'shipping_address_json',
            'subtotal', 'shipping_fee', 'tax', 'total_amount',
            'status', 'payment_status', 'payment_method', 'notes',
            'items', 'created_at'
        ]

class CreateOrderSerializer(serializers.Serializer):
    address_id = serializers.IntegerField(required=False)
    shipping_address = serializers.DictField(required=False)
    payment_method = serializers.ChoiceField(
        choices=['COD', 'MOCK_CARD', 'MOCK_UPI', 'MOCK_PAYPAL'],
        default='COD'
    )
    notes = serializers.CharField(required=False, allow_blank=True, default='')

    def validate(self, attrs):
        if not attrs.get('address_id') and not attrs.get('shipping_address'):
            raise serializers.ValidationError("Either address_id or shipping_address is required.")
        return attrs

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'transaction_id', 'payment_method',
            'amount', 'currency', 'status', 'created_at'
        ]
