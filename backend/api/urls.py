from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    CurrentUserView,
    ChangePasswordView,
    ForgotPasswordView,
    AddressViewSet,
    CategoryListView,
    ProductListView,
    ProductDetailView,
    ReviewCreateView,
    CartView,
    CartItemAddView,
    CartItemUpdateView,
    CartClearView,
    WishlistView,
    WishlistToggleView,
    CheckoutView,
    OrderHistoryView,
    OrderDetailView,
    DashboardStatsView,
    AdminOrderUpdateStatusView
)

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    # 1. Authentication & Profile
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),

    # Addresses (Router)
    path('', include(router.urls)),

    # 2. Catalog: Categories & Products
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('products/', ProductListView.as_view(), name='product_list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product_detail'),
    path('products/<int:product_id>/reviews/', ReviewCreateView.as_view(), name='product_review_create'),

    # 3. Shopping Cart
    path('cart/', CartView.as_view(), name='cart_detail'),
    path('cart/add/', CartItemAddView.as_view(), name='cart_item_add'),
    path('cart/items/<int:item_id>/', CartItemUpdateView.as_view(), name='cart_item_update_delete'),
    path('cart/clear/', CartClearView.as_view(), name='cart_clear'),

    # 4. Wishlist
    path('wishlist/', WishlistView.as_view(), name='wishlist_detail'),
    path('wishlist/toggle/<int:product_id>/', WishlistToggleView.as_view(), name='wishlist_toggle'),

    # 5. Checkout & Orders
    path('orders/checkout/', CheckoutView.as_view(), name='order_checkout'),
    path('orders/', OrderHistoryView.as_view(), name='order_history'),
    path('orders/<str:order_number>/', OrderDetailView.as_view(), name='order_detail'),

    # 6. Admin Dashboard & Order Management
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('dashboard/orders/<int:order_id>/status/', AdminOrderUpdateStatusView.as_view(), name='admin_order_status'),
]
