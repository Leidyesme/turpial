document.addEventListener("DOMContentLoaded", () => {

    loadOrders();

    setupSearch();

});


async function loadOrders(filteredOrders = null) {
    const ordersList = document.querySelector("#ordersList");
    if (!ordersList) return;

    ordersList.innerHTML = `<p class="orders__empty">Cargando pedidos desde la base de datos...</p>`;

    let orders = [];

    if (filteredOrders) {
        orders = filteredOrders;
    } else {
        try {
            // Realizar petición GET al servlet de pedidos
            const response = await fetch("http://localhost:8080/turpialJava/pedido");
            if (!response.ok) {
                throw new Error("Error en respuesta del servidor (Status " + response.status + ")");
            }
            const dbOrders = await response.json();
            
            // Mapear los datos de DB al formato esperado en la vista y en localStorage
            orders = dbOrders.map(p => ({
                id: p.idPedido,
                clientName: p.nombreClienteOpcional && p.nombreClienteOpcional.trim() !== "" ? p.nombreClienteOpcional : ("Usuario: " + p.idUsuario),
                address: p.direccionEntrega && p.direccionEntrega !== "null" ? p.direccionEntrega : "No especificada",
                status: p.estado || "En preparación",
                total: Number(p.total),
                date: p.fechaPedido || "Sin fecha",
                products: [] // Array de productos vacío para prevenir excepciones en la vista de detalles
            }));

            // Sincronizar en localStorage para compatibilidad con la vista de detalles (orderInfo.html)
            localStorage.setItem("orders", JSON.stringify(orders));
        } catch (error) {
            console.error("Error al cargar pedidos del backend:", error);
            ordersList.innerHTML = `<p class="orders__empty" style="color: red;">Error al conectar con la base de datos.</p>`;
            return;
        }
    }

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
        const orderCard = document.createElement("div");
        orderCard.classList.add("orders__item");

        orderCard.innerHTML = `
            <h2 class="orders__item-title">
                Pedido #${order.id}
            </h2>

            <p class="orders__description">
                <strong>Cliente:</strong>
                ${order.clientName}
            </p>

            <p class="orders__description">
                <strong>Dirección:</strong>
                ${order.address}
            </p>

            <p class="orders__description">
                <strong>Estado:</strong>
                ${order.status}
            </p>

            <p class="orders__description">
                <strong>Total:</strong>
                $${order.total.toLocaleString()}
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