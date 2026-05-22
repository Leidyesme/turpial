document.addEventListener("DOMContentLoaded", () => {
    setupAddToCart();
});

function setupAddToCart() {

    const buttons =
        document.querySelectorAll(".add-to-cart");

    buttons.forEach((button) => {

        button.addEventListener("click", (e) => {

            e.preventDefault();

            const product = {
                name: button.dataset.name,
                price: parseInt(button.dataset.price),
                status: button.dataset.status
            };

            addProduct(product);

        });

    });

}

function addProduct(product) {

    if (product.status === "Agotado") {

        alert("Producto agotado");

        return;
    }

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const existing =
        cart.find(item => item.name === product.name);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Producto agregado");
}