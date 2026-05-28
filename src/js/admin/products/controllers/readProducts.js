import {
    deleteProduct
}
from "./deleteProduct.js";
import {
    updateProduct
}
from "./updateProduct.js";
import {
    getProducts
}
from "../services/productService.js";


export function loadProducts() {

    const products =
        getProducts();


    renderProducts(products);

}


function renderProducts(products) {

    const container =
        document.querySelector(
            "#productsContainer"
        );


    container.innerHTML = "";


    if (products.length === 0) {

        container.innerHTML = `

            <p class="products__empty">

                No hay productos registrados

            </p>

        `;

        return;

    }


    products.forEach(product => {

        const card =
            document.createElement("div");


        card.classList.add(
            "products__card",
            "section"
        );


        card.innerHTML = `

            <img
                src="${product.image}"

                alt="${product.name}"

                class="products__img imgforma">


            <h2 class="products__name">

                ${product.name}

            </h2>


            <p class="products__price">

                Precio: $${product.price}

            </p>


            <p class="products__stock">

                Stock: ${product.stock}

            </p>


            <p class="products__category">

                Categoría:
                ${product.category}

            </p>


            <p class="products__status">

                ${product.status}

            </p>


            <div class="products__actions">

                <button
                    class="btn btn--verde"

                    onclick="updateProduct(${product.id})">

                    Editar

                </button>


                <button
                    class="btn btn--rojo"

                    onclick="deleteProduct(${product.id})">

                    Eliminar

                </button>

            </div>

        `;


        container.appendChild(card);

    });

}