function getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
}


function calculateTotal() {
    const cart = getCart();

    return cart.reduce(
        (total, item) =>
            total + parseFloat(item.price) * item.quantity,
        0
    );
}


function displayTotal() {
    const cart = getCart();
    const total = calculateTotal();

    const totalElement =
        document.getElementById("checkout-total");

    const submitButton =
        document.querySelector(
            '#checkout-form button[type="submit"]'
        );

    if (totalElement) {
        totalElement.textContent =
            `₹${total.toFixed(2)}`;
    }

    if (submitButton) {
        submitButton.disabled =
            cart.length === 0;

        if (cart.length === 0) {
            submitButton.textContent =
                "Cart is Empty";
        } else {
            submitButton.textContent =
                "Place Order";
        }
    }
}


function prepareCartData() {
    const cart = getCart();

    const cartData =
        document.getElementById("cart-data");

    if (cartData) {
        cartData.value = JSON.stringify(cart);
    }
}


async function handleCheckout(event) {

    event.preventDefault();

    prepareCartData();

    const form = event.target;

    const message =
        document.getElementById("checkout-message");

    const formData = new FormData(form);

    try {

        const response = await fetch(
            window.location.href,
            {
                method: "POST",
                body: formData
            }
        );

        const contentType =
            response.headers.get("content-type");

        if (
            contentType &&
            contentType.includes("application/json")
        ) {

            const data = await response.json();

            if (!data.success) {

                message.textContent =
                    `⚠️ ${data.message}`;

                message.style.color =
                    "#dc2626";

                message.style.background =
                    "#fee2e2";

                return;
            }
        }

        if (response.redirected) {

            localStorage.removeItem("cart");

            window.location.href =
                response.url;

            return;
        }

        message.textContent =
            "Something went wrong. Please try again.";

        message.style.color =
            "#dc2626";

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to place the order. Please try again.";

        message.style.color =
            "#dc2626";
    }
}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayTotal();

        const form =
            document.getElementById("checkout-form");

        if (form) {

            form.addEventListener(
                "submit",
                handleCheckout
            );
        }
    }
);