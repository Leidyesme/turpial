document.addEventListener("DOMContentLoaded", () => {

    loadOrders();

    setupSearch();

});


function loadOrders(filteredOrders = null) {

    const ordersList =
        document.querySelector("#ordersList");


    if (!ordersList) return;


    // OBTENER PEDIDOS
    const orders =
        filteredOrders ||
        JSON.parse(
            localStorage.getItem("orders")
        )
        || [];


    // LIMPIAR CONTENEDOR
    ordersList.innerHTML = "";


    // VALIDAR VACÍO
    if (orders.length === 0) {

        ordersList.innerHTML = `

            <p class="orders__empty">
                No hay pedidos registrados
            </p>

        `;

        return;

    }


    // RENDER PEDIDOS
    orders.forEach((order, index) => {

        const orderCard =
            document.createElement("div");


        orderCard.classList.add(
            "orders__item"
        );


        orderCard.innerHTML = `

            <h2 class="orders__item-title">

                ${order.clientName || order.customer || 'Cliente Anónimo'}

            </h2>

            <p class="orders__description">

                <strong>Dirección:</strong>
                ${order.address || 'No especificada'}

            </p>

            <p class="orders__description">

                <strong>Estado:</strong>
                ${order.status}

            </p>

            <p class="orders__description">

                <strong>Total:</strong>
                $${order.total}

            </p>

            <a
                href="../orderInfo/orderInfo.html"

                class="orders__link"

                data-index="${index}">

                Ver detalles

            </a>

        `;


        ordersList.appendChild(orderCard);

    });


    setupOrderLinks();

}


function setupOrderLinks() {

    const links =
        document.querySelectorAll(
            ".orders__link"
        );


    links.forEach((link) => {

        link.addEventListener("click", () => {

            const orderIndex =
                link.dataset.index;


            localStorage.setItem(
                "selectedOrder",
                orderIndex
            );

        });

    });

}


function setupSearch() {

    const searchInput =
        document.querySelector(
            "#searchOrder"
        );


    if (!searchInput) return;


    searchInput.addEventListener("input", () => {

        const searchValue =
            searchInput.value
            .toLowerCase();


        const orders =
            JSON.parse(
                localStorage.getItem("orders")
            )
            || [];


        const filteredOrders =
            orders.filter((order) => {

                return (
                    order.status
                    .toLowerCase()
                    .includes(searchValue)
                );

            });


        loadOrders(filteredOrders);

    });

}