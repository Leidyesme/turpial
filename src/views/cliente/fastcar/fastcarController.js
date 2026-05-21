document.addEventListener("DOMContentLoaded", () => {

    loadCart();

    setupCheckout();

    loadUserInitial();

});


// CARGAR PRODUCTOS DEL CARRITO
function loadCart() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const container =
        document.getElementById("cartContainer");

    const totalElement =
        document.getElementById("cartTotal");


    if (!container) return;


    // CARRITO VACÍO
    if (cart.length === 0) {

        container.innerHTML = `
            <p>No hay productos en el carrito</p>
        `;

        totalElement.textContent = "Total: $0";

        return;
    }


    let total = 0;

    container.innerHTML = "";


    // RECORRER PRODUCTOS
    cart.forEach((product, index) => {

        total += product.price * product.quantity;

        const productHTML = `
            <div class="cart-product">

                <h3>${product.name}</h3>

                <p>
                    Precio:
                    $${product.price.toLocaleString()}
                </p>

                <p>
                    Cantidad:
                    ${product.quantity}
                </p>

                <button
                    class="btn btn--rojo"
                    onclick="removeProduct(${index})">

                    Eliminar

                </button>

            </div>
        `;

        container.innerHTML += productHTML;

    });


    totalElement.textContent =
        `Total: $${total.toLocaleString()}`;
}


// ELIMINAR PRODUCTO
function removeProduct(index) {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    loadCart();
}


// REALIZAR PEDIDO
function setupCheckout() {

    const checkoutBtn =
        document.getElementById("checkoutBtn");

    if (!checkoutBtn) return;


    checkoutBtn.addEventListener("click", () => {

        const cart =
            JSON.parse(localStorage.getItem("cart")) || [];


        if (cart.length === 0) {

            alert("El carrito está vacío");

            return;
        }


        alert("Pedido realizado correctamente");


        // LIMPIAR CARRITO
        localStorage.removeItem("cart");


        // RECARGAR
        loadCart();

    });

}


// CARGAR INICIAL USUARIO
function loadUserInitial() {

    const user =
        JSON.parse(localStorage.getItem("user"));

    const userButton =
        document.querySelector(".profile__usuario");


    if (user && userButton) {

        userButton.textContent =
            user.name.charAt(0).toUpperCase();
    }

}