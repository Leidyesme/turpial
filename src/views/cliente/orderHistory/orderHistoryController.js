document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderOrders(true); // Carga inicial (muestra alertas de error)
    setupBackButton();
    setupFilters();

    // Polling cada 10 segundos (silencioso, no interrumpe al usuario con alertas)
    setInterval(() => {
        fetchAndRenderOrders(false);
    }, 10000);
});

let allOrders = [];

async function fetchAndRenderOrders(showErrors = false) {
    const container = document.querySelector("#ordersContainer");
    if (!container) return;

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
        if (showErrors) {
            alert("Debes iniciar sesión para ver tu historial de pedidos.");
            window.location.href = "../../auth/login/login.html";
        }
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/turpialJava/HistorialServlet?accion=listar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idUsuario: usuarioActivo.idUsuario })
        });

        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();

        if (data.status === "success") {
            allOrders = data.orders || [];
            applyFiltersAndRender();
        } else {
            if (showErrors) alert("Error al cargar pedidos: " + data.message);
        }
    } catch (error) {
        console.error("Error al cargar pedidos:", error);
        if (showErrors) {
            container.innerHTML = `
                <p class="order-history__empty">
                    No se pudo conectar con el servidor para obtener el historial.
                </p>
            `;
        }
    }
}

function setupFilters() {
    const inputs = ["#filterCustomer", "#filterStatus", "#filterDelivery", "#filterDateFrom", "#filterDateTo"];
    inputs.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
            el.addEventListener("input", applyFiltersAndRender);
            el.addEventListener("change", applyFiltersAndRender);
        }
    });
}

function applyFiltersAndRender() {
    const container = document.querySelector("#ordersContainer");
    if (!container) return;

    const customer = document.querySelector("#filterCustomer") ? document.querySelector("#filterCustomer").value.toLowerCase().trim() : "";
    const status = document.querySelector("#filterStatus") ? document.querySelector("#filterStatus").value : "";
    const delivery = document.querySelector("#filterDelivery") ? document.querySelector("#filterDelivery").value : "";
    const dateFrom = document.querySelector("#filterDateFrom") ? document.querySelector("#filterDateFrom").value : "";
    const dateTo = document.querySelector("#filterDateTo") ? document.querySelector("#filterDateTo").value : "";

    let filtered = allOrders.filter(order => {
        if (status && order.status !== status) return false;
        if (delivery && order.tipoEntrega !== delivery) return false;
        
        const customerMatch = (order.customerName || "").toLowerCase();
        if (customer && !customerMatch.includes(customer)) return false;

        if (order.date) {
            const orderDateStr = order.date.split(" ")[0]; // YYYY-MM-DD
            if (dateFrom && orderDateStr < dateFrom) return false;
            if (dateTo && orderDateStr > dateTo) return false;
        }
        return true;
    });

    // Ordenamiento inteligente: Pendientes primero (En preparación, Listo, En espera)
    const pendingStates = ["En preparación", "Listo", "En espera"];
    filtered.sort((a, b) => {
        const aPending = pendingStates.includes(a.status);
        const bPending = pendingStates.includes(b.status);
        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;
        
        // Criterio secundario: Más recientes primero
        const aDate = a.date || "";
        const bDate = b.date || "";
        return bDate.localeCompare(aDate);
    });

    // Limpiar contenedor
    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = `
            <p class="order-history__empty">
                No hay pedidos que coincidan con los filtros
            </p>
        `;
        return;
    }

    filtered.forEach((order, index) => {
        const orderCard = document.createElement("div");
        orderCard.classList.add("order-history__item", "section");

        orderCard.innerHTML = `
            <h2 class="order-history__title">
                Pedido (Ref: ${order.idPedido})
            </h2>
            <p class="order-history__date">
                <strong>Cliente:</strong> ${order.customerName}
            </p>
            <p class="order-history__date">
                <strong>Entrega:</strong> ${order.tipoEntrega}
            </p>
            <p class="order-history__date">
                <strong>Fecha:</strong> ${order.date}
            </p>
            <p class="order-history__total">
                <strong>Total:</strong> $${order.total}
            </p>
            <p class="order-history__status">
                <strong>Estado:</strong> ${order.status}
            </p>
            ${(order.status === "Entregado" && usuarioActivo.rol === "ROL-003") ? `
            <div class="order-history__return-section" style="margin-top: 15px; border-top: 1px solid var(--marron); padding-top: 10px; width: 100%;">
                <button class="btn btn--rojo btn-solicitar-devolucion" data-id="${order.idPedido}" style="width: 100%;">Solicitar Devolución</button>
                <div class="form-devolucion" id="form-dev-${order.idPedido}" style="display: none; margin-top: 10px; flex-direction: column; gap: 8px; width: 100%;">
                    <textarea class="input input-motivo" placeholder="Escribe el motivo de la devolución..." required style="width: 100%; min-height: 60px; box-sizing: border-box;"></textarea>
                    <button class="btn btn--verde btn-enviar-devolucion" data-id="${order.idPedido}" style="width: 100%;">Enviar Solicitud</button>
                </div>
            </div>
            ` : ''}
        `;
        
        // Agregar manejador para expandir/colapsar el formulario
        const btnSolicitar = orderCard.querySelector(".btn-solicitar-devolucion");
        if (btnSolicitar) {
            btnSolicitar.addEventListener("click", () => {
                const form = orderCard.querySelector(".form-devolucion");
                if (form) {
                    form.style.display = form.style.display === "none" ? "flex" : "none";
                }
            });
        }

        // Agregar manejador para enviar la solicitud al servlet
        const btnEnviar = orderCard.querySelector(".btn-enviar-devolucion");
        if (btnEnviar) {
            btnEnviar.addEventListener("click", async () => {
                const idPedido = btnEnviar.dataset.id;
                const motivo = orderCard.querySelector(".input-motivo").value.trim();
                if (!motivo) {
                    alert("Por favor, escribe el motivo de la devolución");
                    return;
                }

                try {
                    const response = await fetch("http://localhost:8080/turpialJava/devolucion?accion=solicitar", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ idPedido, motivo, idUsuario: usuarioActivo.idUsuario })
                    });

                    if (!response.ok) throw new Error();
                    const data = await response.json();
                    
                    if (data.status === "success") {
                        alert("Solicitud de devolución enviada exitosamente");
                        if (usuarioActivo && typeof guardarHistorial === "function") {
                            guardarHistorial(usuarioActivo.email, "Usuario", `Solicitó devolución para el pedido ${idPedido}`);
                        }
                        // Recargar historial
                        fetchAndRenderOrders(false);
                    } else {
                        alert("Error al enviar solicitud: " + data.message);
                    }
                } catch (error) {
                    console.error("Error solicitando devolución:", error);
                    alert("No se pudo conectar con el servidor para enviar la devolución.");
                }
            });
        }

        container.appendChild(orderCard);
    });
}

function setupBackButton() {
    const backButton = document.querySelector("#backButton");
    if (!backButton) return;
    backButton.addEventListener("click", () => {
        window.location.href = "../profile/profile.html";
    });
}