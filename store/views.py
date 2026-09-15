from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout

from products.models import Product, Order, OrderItem


def home(request):
    return render(request, "index.html")


def product_detail(request, product_id):
    return render(
        request,
        "product.html",
        {"product_id": product_id}
    )


def cart(request):
    return render(request, "cart.html")


def register(request):

    if request.method == "POST":

        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")

        if password != confirm_password:
            return render(
                request,
                "register.html",
                {"error": "Passwords do not match."}
            )

        if User.objects.filter(username=username).exists():
            return render(
                request,
                "register.html",
                {"error": "Username already exists."}
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        login(request, user)

        return redirect("home")

    return render(request, "register.html")


def user_login(request):

    if request.method == "POST":

        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:

            login(request, user)

            return redirect("home")

        return render(
            request,
            "login.html",
            {"error": "Invalid username or password."}
        )

    return render(request, "login.html")


def user_logout(request):

    logout(request)

    return redirect("home")

@login_required(login_url="/login/")
def checkout(request):

    if request.method == "GET":
        return render(request, "checkout.html")

    address = request.POST.get("address", "").strip()
    phone = request.POST.get("phone", "").strip()

    if not address or not phone:
        return JsonResponse({
            "success": False,
            "message": "Address and phone number are required."
        }, status=400)

    cart_data = request.POST.get("cart_data", "")

    if not cart_data:
        return JsonResponse({
            "success": False,
            "message": "Your cart is empty."
        }, status=400)

    import json

    try:
        cart = json.loads(cart_data)
    except json.JSONDecodeError:
        return JsonResponse({
            "success": False,
            "message": "Invalid cart data."
        }, status=400)

    if not cart:
        return JsonResponse({
            "success": False,
            "message": "Your cart is empty."
        }, status=400)

    try:

        with transaction.atomic():

            total_amount = 0
            order_items = []

            for item in cart:

                product_id = item.get("id")
                quantity = int(item.get("quantity", 0))

                if quantity <= 0:
                    raise ValueError(
                        "Invalid product quantity."
                    )

                product = Product.objects.select_for_update().get(
                    id=product_id
                )

                if product.stock < quantity:
                    raise ValueError(
                        f"Not enough stock for {product.name}."
                    )

                price = product.price

                total_amount += price * quantity

                order_items.append({
                    "product": product,
                    "quantity": quantity,
                    "price": price,
                })


            order = Order.objects.create(
                user=request.user,
                total_amount=total_amount,
                shipping_address=address,
                phone=phone,
                status="PENDING",
            )


            for item in order_items:

                OrderItem.objects.create(
                    order=order,
                    product=item["product"],
                    quantity=item["quantity"],
                    price=item["price"],
                )

                item["product"].stock -= item["quantity"]

                item["product"].save(
                    update_fields=["stock"]
                )


        return redirect(
            "order-confirmation",
            order_id=order.id
        )


    except Product.DoesNotExist:

        return JsonResponse({
            "success": False,
            "message": "One of the products no longer exists."
        }, status=400)


    except ValueError as error:

        return JsonResponse({
            "success": False,
            "message": str(error)
        }, status=400)

@login_required(login_url="/login/")
def order_confirmation(request, order_id):

    try:
        order = Order.objects.get(
            id=order_id,
            user=request.user
        )

    except Order.DoesNotExist:
        return redirect("home")

    return render(
        request,
        "order_confirmation.html",
        {"order": order}
    )

@login_required(login_url="/login/")
def order_history(request):

    orders = (
        Order.objects
        .filter(user=request.user)
        .prefetch_related("items__product")
        .order_by("-created_at")
    )

    return render(
        request,
        "order_history.html",
        {"orders": orders}
    )