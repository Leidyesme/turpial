document.addEventListener("DOMContentLoaded", () => {

    renderOrders();

    setupBackButton();

});


async function renderOrders() {
    const container = document.querySelector("#ordersContainer");
    if (!container) return;

    // Obtener el usuario activo de localStorage
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
        alert("Debes iniciar sesión para ver tu historial de pedidos.");
        window.location.href = "../../auth/login/login.html";
        return;
    }

    try {
        // Realizar fetch al backend para obtener los pedidos del usuario
        const response = await fetch("http://localhost:8080/turpialJava/HistorialServlet?accion=listar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idUsuario: usuarioActivo.idUsuario })
        });

        // Validar respuesta HTTP
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        // Parsear respuesta a JSON
        const data = await response.json();

        // Validar si la petición se completó exitosamente
        if (data.status === "success") {
            const orders = data.orders || [];

            // Validar si la lista de pedidos está vacía
            if (orders.length === 0) {
                container.innerHTML = `
                    <p class="order-history__empty">
                        No hay pedidos realizados
                    </p>
                `;
                return;
            }

            // Limpiar contenedor
            container.innerHTML = "";

            // Recorrer los pedidos y agregarlos a la vista
            orders.forEach((order, index) => {
                const orderCard = document.createElement("div");
                orderCard.classList.add("order-history__item", "section");

                // Configurar contenido HTML de la tarjeta de pedido
                orderCard.innerHTML = `
                    <h2 class="order-history__title">
                        Pedido #${index + 1} (Ref: ${order.idPedido})
                    </h2>
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

                // Agregar tarjeta al contenedor principal
                container.appendChild(orderCard);
            });
        } else {
            alert("Error al cargar pedidos: " + data.message);
        }
    } catch (error) {
        console.error("Error al cargar pedidos desde el backend:", error);
        container.innerHTML = `
            <p class="order-history__empty">
                No se pudo conectar con el servidor para obtener el historial.
            </p>
        `;
    }
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