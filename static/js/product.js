async function loadProduct() {

    const container =
        document.getElementById(
            "product-detail-container"
        );

    try {

        const response = await fetch(
            `/api/products/${productId}/`
        );

        if (!response.ok) {
            throw new Error("Product not found");
        }

        const product = await response.json();


        container.innerHTML = `

            <div class="product-info">

                <p class="product-category">
                    ${product.category.name}
                </p>

                <h1>
                    ${product.name}
                </h1>

                <p class="product-description">
                    ${product.description}
                </p>

                <h2 class="product-price">
                    ₹${product.price}
                </h2>

                <p class="product-stock">
                    Available Stock:
                    <strong>${product.stock}</strong>
                </p>


                <div class="quantity-control">

                    <label for="quantity">
                        Quantity:
                    </label>

                    <input
                        id="quantity"
                        type="number"
                        value="1"
                        min="1"
                        max="${product.stock}"
                    >

                </div>


                <button
                    class="add-cart-button"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart 🛒
                </button>

            </div>

        `;

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <h2>
                Product could not be loaded.
            </h2>

            <a href="/">
                Return to Products
            </a>
        `;

    }
}


async function addToCart(productId) {

    const quantity =
        parseInt(
            document.getElementById("quantity").value
        );


    try {

        const response = await fetch(
            `/api/products/${productId}/`
        );


        if (!response.ok) {
            throw new Error("Product not found");
        }


        const product = await response.json();


        let cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        const existingProduct =
            cart.find(
                item => item.id === product.id
            );


        if (existingProduct) {

            existingProduct.quantity += quantity;

        } else {

            cart.push({

                id: product.id,

                name: product.name,

                price: product.price,

                quantity: quantity

            });

        }


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        alert(
            `${product.name} added to cart!`
        );


        window.location.href = "/cart/";


    } catch (error) {

        console.error(error);

        alert(
            "Unable to add product to cart."
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadProduct
);