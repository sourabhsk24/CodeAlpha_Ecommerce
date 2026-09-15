function getCart() {

    const cart = localStorage.getItem("cart");

    return cart ? JSON.parse(cart) : [];

}


function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartCount =
        document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }

}


function renderCart() {

    const container =
        document.getElementById("cart-container");

    const cart = getCart();


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add some products to get started.
                </p>

                <a href="/">
                    Continue Shopping
                </a>

            </div>

        `;

        updateCartCount();

        return;
    }


    let subtotal = 0;


    let html = "";


    cart.forEach((item, index) => {

        const itemTotal =
            parseFloat(item.price) *
            item.quantity;

        subtotal += itemTotal;


        html += `

            <div class="cart-item">

                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p class="cart-item-price">
                        ₹${parseFloat(item.price).toFixed(2)}
                    </p>

                </div>


                <div class="cart-controls">

                    <button
                        onclick="decreaseQuantity(${index})"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})"
                    >
                        +
                    </button>

                    <button
                        class="remove-button"
                        onclick="removeItem(${index})"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;

    });


    html += `

        <div class="cart-summary">

            <p class="cart-total">
                Total: ₹${subtotal.toFixed(2)}
            </p>

            <a
                href="/checkout/"
                class="checkout-button"
            >
                Proceed to Checkout
            </a>

        </div>

    `;


    container.innerHTML = html;

    updateCartCount();

}


function increaseQuantity(index) {

    const cart = getCart();

    cart[index].quantity += 1;

    saveCart(cart);

    renderCart();

}


function decreaseQuantity(index) {

    const cart = getCart();

    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);

    }

    saveCart(cart);

    renderCart();

}


function removeItem(index) {

    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    renderCart();

}


document.addEventListener(
    "DOMContentLoaded",
    renderCart
);
