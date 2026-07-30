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


        // Centralizar rutas de imágenes de forma robusta para compatibilidad con Live Server, Vite y file://
        let imagePath = "/turpial.png";
        if (product.image && product.image !== "null" && product.image !== "undefined" && product.image.trim() !== "") {
            if (product.image.startsWith("http://") || product.image.startsWith("https://")) {
                imagePath = product.image;
            } else {
                let cleanPath = product.image;
                if (cleanPath.includes("public/")) {
                    cleanPath = cleanPath.substring(cleanPath.indexOf("public/") + 7);
                }
                if (cleanPath.startsWith("/")) {
                    cleanPath = cleanPath.substring(1);
                }
                // Todas las vistas HTML están a 4 niveles de profundidad de la raíz (src/views/*/*/*.html)
                imagePath = "../../../../public/" + cleanPath;
            }
        }

        const categoryMap = {
            "CAT-001": "Desayuno",
            "CAT-002": "Almuerzo",
            "CAT-003": "Bebidas",
            "CAT-004": "Panadería",
            "CAT-005": "Comida Rápida",
            "CAT-006": "Promociones"
        };
        const categoryDisplay = categoryMap[product.category] || product.category;

        card.innerHTML = `
            <img src="${imagePath}" alt="${product.name}" class="products__img imgforma">
            <h2 class="products__name">${product.name}</h2>
            <p class="products__price">Precio: $${product.price}</p>
            <p class="products__stock">Stock: ${product.stock}</p>
            <p class="products__category">Categoría: ${categoryDisplay}</p>
            <p class="products__status">${product.status}</p>


            <div class="products__actions">
                <button class="btn btn--verde edit-prod-btn" data-id="${product.id}">
                    Editar
                </button>

                <button class="btn btn--rojo delete-prod-btn" data-id="${product.id}">
                    Eliminar
                </button>
            </div>
        `;

        const editBtn = card.querySelector(".edit-prod-btn");
        if (editBtn) {
            editBtn.addEventListener("click", () => updateProduct(product.id));
        }

        const deleteBtn = card.querySelector(".delete-prod-btn");
        if (deleteBtn) {
            deleteBtn.addEventListener("click", () => deleteProduct(product.id));
        }

        container.appendChild(card);
    });
}