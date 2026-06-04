import { deleteOrder } from "./deleteOrder.js";
import { updateOrder } from "./updateOrder.js";

const ORDERS_KEY = "orders";

export function getOrders() {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
}

export function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function loadOrders() {
    const container = document.querySelector("#ordersContainer");
    if (!container) return;

    const orders = getOrders();
    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = `
            <p class="adminOrders__empty" style="text-align: center; margin: 20px; font-weight: bold;">
                No hay pedidos registrados en el sistema.
            </p>
        `;
        return;
    }

    orders.forEach((order, index) => {
        const card = document.createElement("div");
        card.classList.add("adminOrders__card", "section");
        card.style.height = "auto";
        card.style.minHeight = "200px";
        card.style.width = "90%";
        card.style.maxWidth = "400px";
        card.style.padding = "15px";
        card.style.margin = "10px auto";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.gap = "8px";
        card.style.alignItems = "stretch";

        // Generate products list text
        const productsHtml = order.products.map(p => 
            `<div style="display: flex; justify-content: space-between; font-size: 13px; color: #555;">
                <span>${p.name} (x${p.quantity})</span>
                <span>$${p.price * p.quantity}</span>
             </div>`
        ).join("");

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
                <span>Pedido #${index + 1}</span>
                <span style="font-size: 12px; color: #666;">${order.date || 'Sin fecha'}</span>
            </div>
            <div style="text-align: left; font-size: 14px;">
                <p style="margin: 3px 0;"><strong>Cliente:</strong> ${order.clientName || order.customer || 'Cliente Anónimo'}</p>
                <p style="margin: 3px 0;"><strong>Dirección:</strong> ${order.address || 'No especificada'}</p>
                <p style="margin: 3px 0;"><strong>Estado:</strong> ${order.status}</p>
            </div>
            <div style="border-top: 1px dashed #ccc; border-bottom: 1px dashed #ccc; padding: 5px 0; margin: 5px 0;">
                <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 13px; text-align: left;">Productos:</p>
                ${productsHtml}
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 8px;">
                <span>Total:</span>
                <span>$${order.total}</span>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                <button class="btn btn--rojo" style="padding: 8px 15px; font-size: 13px;" id="delete-btn-${index}">Eliminar</button>
            </div>
        `;

        container.appendChild(card);

        // Bind events
        document.getElementById(`delete-btn-${index}`).addEventListener("click", () => {
            deleteOrder(index);
        });
    });
}