document.addEventListener("DOMContentLoaded", () => {
    setupReturns();
    renderReturns();
});

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

        try {
            const response = await fetch("http://localhost:8080/turpialJava/devolucion?accion=solicitar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idPedido: pedido,
                    motivo: motivo
                })
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const data = await response.json();

            if (data.status === "success") {
                const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
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
                    <div class="section" style="width: 100%; max-width: 400px; margin: 10px auto; text-align: left; padding: 15px; box-sizing: border-box; min-height: auto;">
                        <h3 style="margin: 0; color: var(--marron);">Solicitud: ${devolucion.idDevolucion}</h3>
                        <p style="margin: 5px 0;"><strong>Pedido:</strong> ${devolucion.idPedido}</p>
                        <p style="margin: 5px 0;"><strong>Motivo:</strong> ${devolucion.motivo}</p>
                        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${devolucion.fechaSolicitud}</p>
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
