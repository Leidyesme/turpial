document.addEventListener("DOMContentLoaded", () => {

    renderCart();

    setupCheckout();

});


function renderCart() {

    const cartContainer =
        document.querySelector("#cartContainer");

    const cartTotal =
        document.querySelector("#cartTotal");


    if (!cartContainer || !cartTotal) return;


    // OBTENER CARRITO
    const cart =
        JSON.parse(localStorage.getItem("cart"))
        || [];


    // VALIDAR CARRITO VACÍO
    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <p class="fastcar__empty">

                El carrito está vacío

            </p>

        `;

        cartTotal.textContent =
            "Total: $0";

        return;
    }


    // LIMPIAR CONTENEDOR
    cartContainer.innerHTML = "";


    // TOTAL
    let total = 0;


    // RECORRER PRODUCTOS
    cart.forEach((product, index) => {

        total +=
            product.price * product.quantity;


        const productCard =
        document.createElement("div");


        productCard.classList.add(
            "fastcar__product"
        );


        productCard.innerHTML = `

            <img src="${product.image}" alt="${product.name}" class="fastcar__img">

            <div class="fastcar__info">

                <h3>${product.name}</h3>

                <p>
                    Precio:
                    $${product.price}
                </p>

                <p>
                    Cantidad:
                    ${product.quantity}
                </p>

                <button
                    class="btn btn--rojo remove-btn"
                    data-index="${index}">

                    Eliminar

                </button>

            </div>

        `;


        cartContainer.appendChild(productCard);

    });


    // MOSTRAR TOTAL
    cartTotal.textContent =
        `Total: $${total}`;


    // CONFIGURAR BOTONES ELIMINAR
    setupRemoveButtons();

}


function setupRemoveButtons() {

    const removeButtons =
        document.querySelectorAll(".remove-btn");


    removeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const index =
                button.dataset.index;


            let cart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];


            // ELIMINAR PRODUCTO
            cart.splice(index, 1);


            // GUARDAR
            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            // RECARGAR
            renderCart();

        });

    });

}


function setupCheckout() {

    const checkoutButton =
        document.querySelector("#checkoutButton");


    if (!checkoutButton) return;


    checkoutButton.addEventListener("click", () => {

        const cart =
            JSON.parse(localStorage.getItem("cart"))
            || [];


        // VALIDAR CARRITO
        if (cart.length === 0) {

            alert("El carrito está vacío");

            return;
        }


        // OBTENER PEDIDOS
        const orders =
            JSON.parse(localStorage.getItem("orders"))
            || [];


        // CALCULAR TOTAL
        const total =
            cart.reduce(
                (acc, item) =>
                    acc + item.price * item.quantity,
                0
            );


        // CREAR PEDIDO
        const newOrder = {

            id: Date.now(),

            date:
                new Date()
                .toLocaleDateString(),

            total,

            status: "En proceso",

            image: cart[0].image,

            name: cart[0].name,

            products: cart

        };


        // GUARDAR PEDIDO
        orders.push(newOrder);


        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );


        // LIMPIAR CARRITO
        localStorage.removeItem("cart");


        alert("Pedido realizado correctamente");


        // RECARGAR
        renderCart();

    });

}