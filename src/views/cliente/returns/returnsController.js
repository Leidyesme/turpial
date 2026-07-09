document.addEventListener("DOMContentLoaded", () => {
    setupReturns();
    renderReturns();
});

/**
 * Configura el formulario para solicitar una devolución de pedido.
 * Solo utilizable para clientes. Envía idUsuario del cliente en la petición.
 */
function setupReturns() {
    const form = document.querySelector("#returnsForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const pedido = document.querySelector("#pedido").value.trim();
        const motivo = document.querySelector("#motivo").value.trim();

        if (!pedido || !motivo) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
        const idUsuario = usuarioActivo ? usuarioActivo.idUsuario : null;

        try {
            const response = await fetch("http://localhost:8080/turpialJava/devolucion?accion=solicitar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idPedido: pedido,
                    motivo: motivo,
                    idUsuario: idUsuario
                })
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const data = await response.json();

            if (data.status === "success") {
                const email = usuarioActivo ? usuarioActivo.email : "Cliente";
                if (typeof guardarHistorial === "function") {
                    guardarHistorial(email, "Usuario", `Registró devolución para pedido ${pedido}`);
                }

                alert("Devolución registrada correctamente en el servidor");
                form.reset();
                renderReturns();
            } else {
                alert("Error al registrar devolución: " + data.message);
            }
        } catch (error) {
            console.error("Error al registrar devolución:", error);
            alert("Error al conectar con el servidor.");
        }
    });
}

/**
 * Renderiza en la interfaz de usuario el listado de las devoluciones que ha solicitado.
 * Muestra el estado del proceso (incluyendo 'Pendiente') y la respuesta dada por el administrador si existe.
 */
async function renderReturns() {
    const container = document.querySelector("#listaDevoluciones");
    if (!container) return;

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
        container.innerHTML = "<p>Debes iniciar sesión para ver tus devoluciones.</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/turpialJava/devolucion?accion=listar&idUsuario=${usuarioActivo.idUsuario}`);
        if (!response.ok) throw new Error();

        const data = await response.json();
        container.innerHTML = "";

        if (data.status === "success" && data.returns && data.returns.length > 0) {
            data.returns.forEach(devolucion => {
                container.innerHTML += `
                    <div class="section" style="width: 100%; max-width: 400px; margin: 10px auto; text-align: left; padding: 15px; box-sizing: border-box; min-height: auto; border: 1px solid var(--marron);">
                        <h3 style="margin: 0; color: var(--marron);">Solicitud: ${devolucion.idDevolucion}</h3>
                        <p style="margin: 5px 0;"><strong>Pedido:</strong> ${devolucion.idPedido}</p>
                        <p style="margin: 5px 0;"><strong>Motivo:</strong> ${devolucion.motivo}</p>
                        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${devolucion.fechaSolicitud}</p>
                        ${devolucion.respuestaAdmin ? `
                            <p style="margin: 10px 0 5px 0; padding: 8px; background-color: var(--beige); border-radius: 8px; border-left: 4px solid var(--marron); font-size: 0.95em;">
                                <strong>Respuesta del Administrador:</strong> ${devolucion.respuestaAdmin}
                            </p>
                        ` : ''}
                        <button class="btn ${devolucion.estadoDevolucion === 'Aprobada' ? 'btn--verde' : (devolucion.estadoDevolucion === 'Rechazada' ? 'btn--rojo' : 'btn--beige')}" style="width: 100%; margin-top: 10px; cursor: default;">
                            ${devolucion.estadoDevolucion}
                        </button>
                    </div>
                `;
            });
        } else {
            container.innerHTML = "<p class='order-history__empty' style='margin-top: 20px;'>No tienes devoluciones registradas.</p>";
        }
    } catch (error) {
        console.error("Error al cargar devoluciones:", error);
        container.innerHTML = "<p>Error al conectar con el servidor para obtener las devoluciones.</p>";
    }
}
