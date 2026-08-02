import { deleteOrder } from "./deleteOrder.js";
import { updateOrder } from "./updateOrder.js";

const ORDERS_KEY = "orders";

export function getOrders() {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
}

export function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export async function loadOrders() {
    const container = document.querySelector("#ordersContainer");
    if (!container) return;

    // Obtener el usuario activo para validar permisos y obtener el ID
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
        container.innerHTML = `<p style="text-align: center; margin: 20px;">Por favor, inicie sesión.</p>`;
        return;
    }

    container.innerHTML = `<p style="text-align: center; margin: 20px;">Cargando historial desde la base de datos...</p>`;

    try {
        // Enviar petición GET a HistorialServlet con la acción 'listar' y el idUsuario
        const response = await fetch(`http://localhost:8080/turpialJava/HistorialServlet?accion=listar&idUsuario=${usuarioActivo.idUsuario}`);
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor (Status " + response.status + ")");
        }

        const data = await response.json();
        if (data.status !== "success") {
            throw new Error(data.message);
        }

        let orders = data.orders || [];
        container.innerHTML = "";

        const searchInput = document.querySelector("#adminOrderSearch");
        const paymentFilter = document.querySelector("#adminOrderPaymentFilter");

        if (searchInput && !searchInput.dataset.listening) {
            searchInput.dataset.listening = "true";
            searchInput.oninput = () => loadOrders();
        }
        if (paymentFilter && !paymentFilter.dataset.listening) {
            paymentFilter.dataset.listening = "true";
            paymentFilter.onchange = () => loadOrders();
        }

        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const payStatus = paymentFilter ? paymentFilter.value.trim() : "";

        if (query || payStatus) {
            orders = orders.filter(order => {
                if (payStatus && (order.estadoPago || order.estado_pago || "Sin pagar") !== payStatus) {
                    return false;
                }
                if (query) {
                    const idStr = String(order.idPedido || "").toLowerCase();
                    const clientStr = String(order.customerName || "").toLowerCase();
                    const statusStr = String(order.status || "").toLowerCase();
                    const tipoStr = String(order.tipoEntrega || "").toLowerCase();
                    return idStr.includes(query) || clientStr.includes(query) || statusStr.includes(query) || tipoStr.includes(query);
                }
                return true;
            });
        }

        if (orders.length === 0) {
            container.innerHTML = `
                <p class="adminOrders__empty" style="text-align: center; margin: 20px; font-weight: bold;">
                    No se encontraron pedidos con los criterios ingresados.
                </p>
            `;
            return;
        }

        // Renderizar cada pedido obtenido de la base de datos
        orders.forEach((order, index) => {
            const card = document.createElement("div");
            card.classList.add("adminOrders__card", "section");
            card.style.height = "auto";
            card.style.minHeight = "160px";
            card.style.width = "90%";
            card.style.maxWidth = "400px";
            card.style.padding = "15px";
            card.style.margin = "10px auto";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.gap = "8px";
            card.style.alignItems = "stretch";

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
                    <span>Pedido #${order.idPedido}</span>
                    <span style="font-size: 12px; color: #666;">${order.date || 'Sin fecha'}</span>
                </div>
                <div style="text-align: left; font-size: 14px;">
                    <p style="margin: 3px 0;"><strong>Cliente:</strong> ${order.customerName || 'Cliente Anónimo'}</p>
                    <p style="margin: 3px 0;"><strong>Tipo Entrega:</strong> ${order.tipoEntrega || 'No especificado'}</p>
                    <p style="margin: 3px 0;"><strong>Estado:</strong> ${order.status}</p>
                    <p style="margin: 3px 0;"><strong>Estado de Pago:</strong> <span style="font-weight: bold; color: ${(order.estadoPago || order.estado_pago || '').toLowerCase() === 'pagado' ? '#2e7d32' : '#d32f2f'};">${order.estadoPago || order.estado_pago || 'Sin pagar'}</span></p>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 5px; border-top: 1px dashed #ccc; padding-top: 5px;">
                    <span>Total:</span>
                    <span>$${Number(order.total).toLocaleString()}</span>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar historial desde la DB:", error);
        container.innerHTML = `<p style="text-align: center; margin: 20px; color: red;">Error al conectar con la base de datos: ${error.message}</p>`;
    }
}