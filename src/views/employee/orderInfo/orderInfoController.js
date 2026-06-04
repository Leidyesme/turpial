document.addEventListener("DOMContentLoaded", () => {

    loadOrderInfo();

    setupButtons();

});


let currentOrder = null;

let currentIndex = null;


function loadOrderInfo() {

    // OBTENER INDEX
    currentIndex =
        localStorage.getItem(
            "selectedOrder"
        );


    // OBTENER PEDIDOS
    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        )
        || [];


    // VALIDAR
    if (
        currentIndex === null ||
        !orders[currentIndex]
    ) {

        alert("Pedido no encontrado");

        window.location.href =
            "../orders/orders.html";

        return;

    }


    currentOrder =
        orders[currentIndex];


    // ELEMENTOS
    const orderNumber =
        document.querySelector("#orderNumber");

    const orderDate =
        document.querySelector("#orderDate");

    const orderStatus =
        document.querySelector("#orderStatus");

    const orderAddress =
        document.querySelector("#orderAddress");

    const orderTotal =
        document.querySelector("#orderTotal");

    const orderProducts =
        document.querySelector("#orderProducts");


    // RENDER INFO
    orderNumber.textContent =
        `${currentOrder.clientName || currentOrder.customer || 'Cliente Anónimo'}`;

    orderDate.textContent =
        `Fecha: ${currentOrder.date}`;

    orderStatus.textContent =
        `Estado: ${currentOrder.status}`;

    if (orderAddress) {
        orderAddress.textContent =
            `Dirección: ${currentOrder.address || 'No especificada'}`;
    }

    orderTotal.textContent =
        `Total: $${currentOrder.total}`;


    // LIMPIAR PRODUCTOS
    orderProducts.innerHTML = "";


    // RENDER PRODUCTOS
    currentOrder.products.forEach((product) => {

        const productCard =
            document.createElement("div");


        productCard.classList.add(
            "orderinfo__product"
        );


        productCard.innerHTML = `

            <p>

                ${product.name}

            </p>

            <p>

                Cantidad:
                ${product.quantity}

            </p>

            <p>

                Precio:
                $${product.price}

            </p>

        `;


        orderProducts.appendChild(
            productCard
        );

    });


    // Establecer el valor seleccionado en el select dropdown
    const statusSelect = document.querySelector("#statusSelect");
    if (statusSelect) {
        statusSelect.value = currentOrder.status;
    }

}


function setupButtons() {

    // BOTÓN VOLVER
    const backBtn =
        document.querySelector("#backBtn");


    backBtn.addEventListener("click", () => {

        window.location.href =
            "../orders/orders.html";

    });


    // BOTÓN ACTUALIZAR
    const updateStatusBtn =
        document.querySelector(
            "#updateStatusBtn"
        );


    updateStatusBtn.addEventListener("click", () => {

        updateOrderStatus();

    });

}


function updateOrderStatus() {

    const statusSelect = document.querySelector("#statusSelect");
    if (!statusSelect) return;

    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        )
        || [];


    // Asignar el estado seleccionado
    currentOrder.status = statusSelect.value;


    // ACTUALIZAR ARRAY
    orders[currentIndex] =
        currentOrder;


    // GUARDAR
    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    // RECARGAR
    loadOrderInfo();


    alert(
        "Estado actualizado correctamente"
    );

}