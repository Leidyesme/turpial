document.addEventListener("DOMContentLoaded", () => {

    renderOrders();

    setupBackButton();

});


function renderOrders() {

    const container =
        document.querySelector("#ordersContainer");


    if (!container) return;


    // OBTENER PEDIDOS
    const orders =
        JSON.parse(localStorage.getItem("orders"))
        || [];


    // VALIDAR SI NO HAY PEDIDOS
    if (orders.length === 0) {

        container.innerHTML = `

            <p class="order-history__empty">

                No hay pedidos realizados

            </p>

        `;

        return;
    }


    // LIMPIAR CONTENEDOR
    container.innerHTML = "";


    // RECORRER PEDIDOS
    orders.forEach((order, index) => {

        const orderCard =
        document.createElement("div");


        orderCard.classList.add(
            "order-history__item",
            "section"
        );


        orderCard.innerHTML = `

            <h2 class="order-history__title">

                Pedido #${index + 1}

            </h2>

            <img src="${order.image}"
                 alt="${order.name}"
                 class="order-history__image">

            <p class="order-history__date">

                Fecha: ${order.date}

            </p>

            <p class="order-history__total">

                Total: $${order.total}

            </p>

            <p class="order-history__status">

                Estado: ${order.status}

            </p>

        `;


        container.appendChild(orderCard);

    });

}


function setupBackButton() {

    const backButton =
        document.querySelector("#backButton");


    if (!backButton) return;


    backButton.addEventListener("click", () => {

        window.location.href =
        "../profile/profile.html";

    });

}