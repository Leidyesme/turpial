document.addEventListener("DOMContentLoaded", () => {

    loadOrderInfo();

    setupButtons();

});


let currentOrder = null;

let currentIndex = null;


async function loadOrderInfo() {
    // OBTENER INDEX
    currentIndex = localStorage.getItem("selectedOrder");

    // OBTENER PEDIDOS
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // VALIDAR
    if (currentIndex === null || !orders[currentIndex]) {
        alert("Pedido no encontrado");
        window.location.href = "../orders/orders.html";
        return;
    }

    currentOrder = orders[currentIndex];

    // ELEMENTOS
    const orderNumber = document.querySelector("#orderNumber");
    const orderDate = document.querySelector("#orderDate");
    const orderStatus = document.querySelector("#orderStatus");
    const orderAddress = document.querySelector("#orderAddress");
    const orderTotal = document.querySelector("#orderTotal");
    const orderProducts = document.querySelector("#orderProducts");

    // RENDER INFO LOCAL PREVIA
    orderNumber.textContent = `${currentOrder.clientName}`;
    orderDate.textContent = `Fecha: ${currentOrder.date}`;
    orderStatus.textContent = `Estado: ${currentOrder.status}`;
    if (orderAddress) {
        orderAddress.textContent = `Dirección: ${currentOrder.address}`;
    }
    orderTotal.textContent = `Total: $${currentOrder.total.toLocaleString()}`;

    // Establecer el valor seleccionado en el select dropdown con el estado local inicial
    const statusSelect = document.querySelector("#statusSelect");
    const updateStatusBtn = document.querySelector("#updateStatusBtn");
    if (statusSelect) {
        statusSelect.value = currentOrder.status;
    }

    if (currentOrder.status === "Entregado") {
        if (statusSelect) statusSelect.disabled = true;
        if (updateStatusBtn) updateStatusBtn.disabled = true;
    } else {
        if (statusSelect) statusSelect.disabled = false;
        if (updateStatusBtn) updateStatusBtn.disabled = false;
    }

    // CARGAR DETALLES EN TIEMPO REAL DESDE LA BASE DE DATOS (MÓDULO DE PRODUCTOS)
    orderProducts.innerHTML = "<p>Cargando productos de la base de datos...</p>";

    try {
        const response = await fetch(`http://localhost:8080/turpialJava/pedido?idPedido=${currentOrder.id}`);
        if (!response.ok) {
            throw new Error("Error en respuesta de detalles de pedido (Status " + response.status + ")");
        }
        
        const detailedOrder = await response.json();
        
        // Actualizar datos de cabecera con el detalle fresco de la base de datos
        orderNumber.textContent = `Pedido #${detailedOrder.idPedido} - ${detailedOrder.nombreClienteOpcional}`;
        orderDate.textContent = `Fecha: ${detailedOrder.fechaPedido}`;
        orderStatus.textContent = `Estado: ${detailedOrder.estado}`;
        if (orderAddress) {
            orderAddress.textContent = `Dirección: ${detailedOrder.direccionEntrega && detailedOrder.direccionEntrega !== "null" ? detailedOrder.direccionEntrega : "No especificada"}`;
        }
        orderTotal.textContent = `Total: $${Number(detailedOrder.total).toLocaleString()}`;
        
        if (statusSelect) {
            statusSelect.value = detailedOrder.estado;
        }

        if (detailedOrder.estado === "Entregado") {
            if (statusSelect) statusSelect.disabled = true;
            if (updateStatusBtn) updateStatusBtn.disabled = true;
        } else {
            if (statusSelect) statusSelect.disabled = false;
            if (updateStatusBtn) updateStatusBtn.disabled = false;
        }

        // Sincronizar en el objeto local
        currentOrder.status = detailedOrder.estado;
        currentOrder.clientName = detailedOrder.nombreClienteOpcional;
        currentOrder.address = detailedOrder.direccionEntrega && detailedOrder.direccionEntrega !== "null" ? detailedOrder.direccionEntrega : "No especificada";
        currentOrder.total = Number(detailedOrder.total);

        // Renderizar los productos reales del detallepedido
        orderProducts.innerHTML = "";
        const products = detailedOrder.products || [];

        if (products.length === 0) {
            orderProducts.innerHTML = "<p>No hay productos registrados en este pedido.</p>";
            return;
        }

        products.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("orderinfo__product");
            productCard.style.padding = "10px";
            productCard.style.borderBottom = "1px solid #eee";
            productCard.style.display = "flex";
            productCard.style.flexDirection = "column";
            productCard.style.gap = "4px";

            productCard.innerHTML = `
                <p style="margin: 0; font-weight: bold;">${product.name}</p>
                <div style="display: flex; justify-content: space-between; font-size: 13px; color: #555;">
                    <span>Cantidad: ${product.quantity}</span>
                    <span>Precio Unitario: $${Number(product.price).toLocaleString()}</span>
                    <span>Subtotal: $${(Number(product.price) * Number(product.quantity)).toLocaleString()}</span>
                </div>
            `;
            orderProducts.appendChild(productCard);
        });
    } catch (error) {
        console.error("Error al cargar los detalles completos del pedido:", error);
        orderProducts.innerHTML = `<p style="color: red; font-weight: bold;">Error al conectar con la base de datos para cargar productos.</p>`;
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


async function updateOrderStatus() {
    const statusSelect = document.querySelector("#statusSelect");
    if (!statusSelect) return;

    const nuevoEstado = statusSelect.value;
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Estructurar el cuerpo JSON para enviar al Servlet (idPedido y status)
    const payload = {
        idPedido: currentOrder.id,
        status: nuevoEstado
    };

    try {
        console.log("[DEBUG - updateOrderStatus] Enviando actualización de estado:", payload);
        
        // Realizar la petición PUT al servlet de pedidos
        const response = await fetch("http://localhost:8080/turpialJava/pedido", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor: Status " + response.status);
        }

        const data = await response.json();
        if (data.status === "success") {
            // Actualizar localmente para mantener la vista sincronizada
            currentOrder.status = nuevoEstado;
            orders[currentIndex] = currentOrder;
            localStorage.setItem("orders", JSON.stringify(orders));

            loadOrderInfo();
            alert("¡Estado del pedido actualizado correctamente en MySQL!");
        } else {
            alert("Error al actualizar en la base de datos: " + data.message);
        }
    } catch (error) {
        console.error("Error al enviar petición PUT de estado:", error);
        alert("No se pudo conectar con el servidor. Verifica que Tomcat esté activo.");
    }
}