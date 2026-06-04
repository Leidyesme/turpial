import {
    addToCart
}
from "./cart.js";


export function setupCartButtons() {

    const buttons =
        document.querySelectorAll(
            ".addToCartBtn, .add-to-cart"
        );

    // Obtener los productos actuales del inventario de localStorage
    const productsDb = JSON.parse(localStorage.getItem("products")) || [];

    buttons.forEach(button => {
        const productName = button.dataset.name;
        
        // Intentar encontrar el producto en la base de datos local
        const matchedProduct = productsDb.find(p => p.name === productName);
        
        if (matchedProduct) {
            // Actualizar los atributos de datos del botón
            button.dataset.price = matchedProduct.price;
            button.dataset.status = matchedProduct.status;

            // Intentar actualizar la visualización en la interfaz del cliente
            // Buscamos la tarjeta contenedora del producto
            const card = button.closest('.section, .breakfast__item, .lunch__item, .fastFood__item, .drinks__item, .bakery__item, .promotion__item');
            if (card) {
                // 1. Actualizar texto de precio
                const priceEl = card.querySelector('[class*="price"]');
                if (priceEl) {
                    priceEl.textContent = `Precio: $${Number(matchedProduct.price).toLocaleString()}`;
                }

                // 2. Actualizar botón/badge de estado
                const statusBtn = card.querySelector('.state button, .breakfast__state button, .lunch__state button, .fastFood__state button, .drinks__state button, .bakery__state button, .promotion__state button');
                if (statusBtn) {
                    statusBtn.textContent = matchedProduct.status;
                    if (matchedProduct.status === "Agotado") {
                        statusBtn.className = "btn btn--rojo";
                    } else {
                        statusBtn.className = "btn btn--verde";
                    }
                }
            }
        }

        button.addEventListener(
            "click",

            (e) => {
                e.preventDefault();

                const product = {

                    name:
                        button.dataset.name,

                    price:
                        Number(
                            button.dataset.price
                        ),

                    image:
                        button.dataset.image,

                    status:
                        button.dataset.status || "Disponible"

                };


                addToCart(product);

            }
        );

    });

}