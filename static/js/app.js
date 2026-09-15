const API_URL = "/api/products/";


async function loadProducts() {

    const container = document.getElementById("products-container");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const products = await response.json();

        container.innerHTML = "";

        products.forEach(product => {

            const card = document.createElement("div");

            card.className = "product-card";

            card.innerHTML = `
                <h3>${product.name}</h3>

                <p class="category">
                    ${product.category.name}
                </p>

                <p class="description">
                    ${product.description}
                </p>

                <p class="price">
                    ₹${product.price}
                </p>

                <p class="stock">
                    Stock: ${product.stock}
                </p>

                <button onclick="viewProduct(${product.id})">
                    View Product
                </button>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p>
                Unable to load products. Please try again.
            </p>
        `;
    }
}


function viewProduct(productId) {

    window.location.href = `/products/${productId}/`;
}


document.addEventListener("DOMContentLoaded", loadProducts);