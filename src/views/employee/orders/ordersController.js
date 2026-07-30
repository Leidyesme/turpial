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
            let dbOrders = await response.json();
            if (!Array.isArray(dbOrders)) {
                console.warn("[WARN - ordersController] La respuesta de /pedido no fue un arreglo:", dbOrders);
                dbOrders = [];
            }
            
            // Mapear los datos de DB al formato esperado en la vista y en localStorage
            orders = dbOrders.map(p => ({
                id: p.idPedido,
                clientName: p.nombreClienteOpcional && p.nombreClienteOpcional.trim() !== "" ? p.nombreClienteOpcional : ("Usuario: " + p.idUsuario),
                address: p.direccionEntrega && p.direccionEntrega !== "null" ? p.direccionEntrega : "No especificada",
                status: p.estado || "En preparación",
                tipoEntrega: p.tipoEntrega || "Para consumir aquí",
                numeroMesa: p.numeroMesa,
                estadoPago: p.estadoPago || (p.tipoEntrega === "Para consumir aquí" ? "Sin pagar" : "Pagado"),
                total: Number(p.total),
                date: p.fechaPedido || "Sin fecha",
                products: []
            }));

            // Ordenar los pedidos estrictamente por ID numérico descendente (Ej: PED-005 siempre irá antes de PED-004)
            orders.sort((a, b) => {
                const numA = parseInt(String(a.id).replace(/\D/g, '')) || 0;
                const numB = parseInt(String(b.id).replace(/\D/g, '')) || 0;
                return numB - numA;
            });

            // Sincronizar el arreglo ordenado en localStorage para compatibilidad con la vista de detalles (orderInfo.html)
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

    // RENDER PEDIDOS CON DETALLE DE MODALIDAD Y SELECTOR DE PAGO
    orders.forEach((order, index) => {
        const orderCard = document.createElement("div");
        orderCard.classList.add("orders__item");

        const isPagado = order.estadoPago === "Pagado";
        const mesaText = order.numeroMesa ? ` (Mesa #${order.numeroMesa})` : "";
        const addressHTML = (order.tipoEntrega === "A domicilio") ? `
            <p class="orders__description">
                <strong>Dirección:</strong>
                ${order.address}
            </p>
        ` : "";

        orderCard.innerHTML = `
            <h2 class="orders__item-title">
                Pedido #${order.id}
            </h2>

            <p class="orders__description">
                <strong>Cliente:</strong>
                ${order.clientName}
            </p>

            <p class="orders__description">
                <strong>Modalidad:</strong>
                ${order.tipoEntrega}${mesaText}
            </p>

            ${addressHTML}

            <p class="orders__description">
                <strong>Estado Cocina:</strong>
                ${order.status}
            </p>

            <div class="orders__description" style="margin: 8px 0;">
                <strong>Estado de Pago:</strong>
                <select class="input payment-toggle-select" data-id="${order.id}" ${isPagado ? "disabled" : ""} style="margin-left: 5px; padding: 4px 8px; font-weight: bold; width: auto; display: inline-block;">
                    <option value="Sin pagar" ${!isPagado ? "selected" : ""}>Sin pagar</option>
                    <option value="Pagado" ${isPagado ? "selected" : ""}>Pagado</option>
                </select>
            </div>

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
    setupPaymentToggles();
}

function setupPaymentToggles() {
    const selects = document.querySelectorAll(".payment-toggle-select");
    selects.forEach(select => {
        select.addEventListener("change", async () => {
            const orderId = select.dataset.id;
            const newPaymentStatus = select.value;

            try {
                const response = await fetch("http://localhost:8080/turpialJava/pedido", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idPedido: orderId,
                        estadoPago: newPaymentStatus
                    })
                });

                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                const res = await response.json();
                if (res.status === "success") {
                    const orders = JSON.parse(localStorage.getItem("orders")) || [];
                    const target = orders.find(o => o.id === orderId);
                    if (target) {
                        target.estadoPago = newPaymentStatus;
                        localStorage.setItem("orders", JSON.stringify(orders));
                    }
                    if (newPaymentStatus === "Pagado") {
                        select.disabled = true;
                    }
                    alert(`Estado de pago del pedido #${orderId} actualizado a: ${newPaymentStatus}`);
                } else {
                    alert("No se pudo actualizar el estado de pago: " + res.message);
                }
            } catch (err) {
                console.error("Error al actualizar estado de pago:", err);
                alert("No se pudo conectar con la base de datos.");
            }
        });
    });
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
            .trim()
            .toLowerCase();


        const orders =
            JSON.parse(
                localStorage.getItem("orders")
            )
            || [];


        const filteredOrders =
            orders.filter((order) => {

                return (
                    order.status.toLowerCase().includes(searchValue) ||
                    order.id.toLowerCase().includes(searchValue) ||
                    order.clientName.toLowerCase().includes(searchValue)
                );

            });


        loadOrders(filteredOrders);

    });

}