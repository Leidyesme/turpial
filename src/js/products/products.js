import { addToCart } from "../cart/cart.js";

document.addEventListener("DOMContentLoaded", () => {
    setupAddToCart();
});

function setupAddToCart() {
    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();

            const product = {
                id: button.dataset.id || button.dataset.idProducto || "",
                idProducto: button.dataset.idProducto || button.dataset.id || "",
                name: button.dataset.name,
                price: parseInt(button.dataset.price),
                status: button.dataset.status || "Disponible"
            };

            addToCart(product);
        });
    });
}