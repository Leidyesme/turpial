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
    const paymentSelect = document.querySelector("#paymentSelect");
    const updateStatusBtn = document.querySelector("#updateStatusBtn");
    if (statusSelect) {
        statusSelect.value = currentOrder.status;
    }
    if (paymentSelect) {
        paymentSelect.value = currentOrder.estadoPago || "Sin pagar";
    }

    if (currentOrder.status === "Entregado") {
        if (statusSelect) statusSelect.disabled = true;
    } else {
        if (statusSelect) statusSelect.disabled = false;
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
            if (detailedOrder.tipoEntrega === "A domicilio") {
                orderAddress.style.display = "block";
                orderAddress.textContent = `Dirección: ${detailedOrder.direccionEntrega && detailedOrder.direccionEntrega !== "null" ? detailedOrder.direccionEntrega : "No especificada"}`;
            } else {
                orderAddress.style.display = "none";
            }
        }
        orderTotal.textContent = `Total: $${Number(detailedOrder.total).toLocaleString()}`;
        
        if (statusSelect) {
            statusSelect.value = detailedOrder.estado;
        }

        if (paymentSelect) {
            const isPagado = (detailedOrder.estadoPago === "Pagado");
            paymentSelect.value = detailedOrder.estadoPago || "Sin pagar";
            paymentSelect.disabled = isPagado;
        }

        if (detailedOrder.estado === "Entregado") {
            if (statusSelect) statusSelect.disabled = true;
        } else {
            if (statusSelect) statusSelect.disabled = false;
        }

        // Sincronizar en el objeto local
        currentOrder.status = detailedOrder.estado;
        currentOrder.estadoPago = detailedOrder.estadoPago || "Sin pagar";
        currentOrder.clientName = detailedOrder.nombreClienteOpcional;
        currentOrder.address = detailedOrder.direccionEntrega && detailedOrder.direccionEntrega !== "null" ? detailedOrder.direccionEntrega : "No especificada";
        currentOrder.total = Number(detailedOrder.total);

        // Limpiar el contenedor antes de renderizar los elementos
        orderProducts.innerHTML = "";

        if (!detailedOrder.products || detailedOrder.products.length === 0) {
            orderProducts.innerHTML = "<p>No hay productos registrados en el detalle del pedido.</p>";
            return;
        }

        // Renderizar cada producto recuperado del backend
        detailedOrder.products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.style.padding = "8px";
            productCard.style.borderBottom = "1px solid #eee";
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
    const backBtn = document.querySelector("#backBtn");
    backBtn.addEventListener("click", () => {
        window.location.href = "../orders/orders.html";
    });

    const updateStatusBtn = document.querySelector("#updateStatusBtn");
    updateStatusBtn.addEventListener("click", () => {
        updateOrderStatus();
    });
}


async function updateOrderStatus() {
    const statusSelect = document.querySelector("#statusSelect");
    const paymentSelect = document.querySelector("#paymentSelect");
    if (!statusSelect) return;

    const nuevoEstado = statusSelect.value;
    const nuevoEstadoPago = paymentSelect ? paymentSelect.value : "Sin pagar";
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const payload = {
        idPedido: currentOrder.id,
        status: nuevoEstado,
        estadoPago: nuevoEstadoPago
    };

    try {
        const response = await fetch("http://localhost:8080/turpialJava/pedido", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor (Status " + response.status + ")");
        }

        const data = await response.json();

        if (data.status === "success") {
            alert("Pedido actualizado exitosamente en la base de datos.");
            
            currentOrder.status = nuevoEstado;
            currentOrder.estadoPago = nuevoEstadoPago;
            
            if (currentIndex !== null && orders[currentIndex]) {
                orders[currentIndex].status = nuevoEstado;
                orders[currentIndex].estadoPago = nuevoEstadoPago;
                localStorage.setItem("orders", JSON.stringify(orders));
            }
            
            const orderStatus = document.querySelector("#orderStatus");
            if (orderStatus) {
                orderStatus.textContent = `Estado: ${nuevoEstado}`;
            }

            if (nuevoEstado === "Entregado") {
                statusSelect.disabled = true;
            }
            if (nuevoEstadoPago === "Pagado" && paymentSelect) {
                paymentSelect.disabled = true;
            }
        } else {
            alert("No se pudo actualizar el pedido: " + data.message);
        }

    } catch (error) {
        console.error("Error al actualizar el estado del pedido:", error);
        alert("Error de conexión al actualizar el pedido.");
    }
}