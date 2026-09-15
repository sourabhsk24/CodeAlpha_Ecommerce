from django.urls import path
from .views import (
    home,
    product_detail,
    cart,
    register,
    user_login,
    user_logout,
    checkout,
    order_confirmation,
    order_history,
)


urlpatterns = [
    path("", home, name="home"),

    path(
        "products/<int:product_id>/",
        product_detail,
        name="product-detail"
    ),

    path(
        "cart/",
        cart,
        name="cart"
    ),

    path(
        "register/",
        register,
        name="register"
    ),

    path(
        "login/",
        user_login,
        name="login"
    ),

    path(
        "logout/",
        user_logout,
        name="logout"
    ),

    path(
        "checkout/",
        checkout,
        name="checkout"
    ),

    path(
        "order-confirmation/<int:order_id>/",
        order_confirmation,
        name="order-confirmation"
    ),

    path(
       "orders/",
        order_history,
        name="order-history"
    ),
]
