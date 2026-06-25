document.addEventListener("DOMContentLoaded", () => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    
    // Verificación de Acceso Basado en Roles (RBAC):
    // El Administrador debe estar debidamente autenticado para cargar la vista operativa de devoluciones.
    if (usuarioActivo && usuarioActivo.rol === "ROL-001") {
        cargarDevoluciones(usuarioActivo);
    } else {
        alert("Acceso denegado: No cuenta con permisos para ver este módulo.");
        window.location.href = "../../cliente/categories/categories.html";
    }

    setupBackButton();
});

/**
 * Realiza la petición al backend para cargar el listado general de devoluciones del sistema.
 * Segrega los elementos entre pendientes y procesadas para una óptima usabilidad operativa.
 * @param {Object} usuario - El usuario administrador activo.
 */
async function cargarDevoluciones(usuario) {
    const pendientesContainer = document.getElementById("devolucionesPendientes");
    const procesadasContainer = document.getElementById("devolucionesProcesadas");
    if (!pendientesContainer || !procesadasContainer) return;

    try {
        const response = await fetch(`http://localhost:8080/turpialJava/devolucion?accion=listarTodas&idUsuario=${usuario.idUsuario}`);
        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();
        pendientesContainer.innerHTML = "";
        procesadasContainer.innerHTML = "";

        let countPendientes = 0;
        let countProcesadas = 0;

        if (data.status === "success" && data.returns && data.returns.length > 0) {
            data.returns.forEach(dev => {
                const isPending = dev.estadoDevolucion === "Pendiente";
                
                const card = document.createElement("div");
                card.className = "section";
                card.style.cssText = "width: 100%; text-align: left; padding: 15px; box-sizing: border-box; margin: 5px 0; min-height: auto; border: 1px solid var(--marron);";

                card.innerHTML = `
                    <h3 style="margin: 0; color: var(--marron); font-size: 1.1em;">Solicitud: ${dev.idDevolucion}</h3>
                    <p style="margin: 4px 0;"><strong>Pedido:</strong> ${dev.idPedido}</p>
                    <p style="margin: 4px 0;"><strong>Motivo de Devolución:</strong> ${dev.motivo}</p>
                    <p style="margin: 4px 0;"><strong>Fecha Solicitada:</strong> ${dev.fechaSolicitud}</p>
                    <p style="margin: 4px 0;"><strong>Estado:</strong> <span style="font-weight: bold; color: ${dev.estadoDevolucion === 'Aprobada' ? 'green' : (dev.estadoDevolucion === 'Rechazada' ? 'red' : 'orange')}">${dev.estadoDevolucion}</span></p>
                    
                    ${dev.respuestaAdmin ? `
                        <p style="margin: 10px 0 4px 0; padding: 8px; background-color: var(--beige); border-radius: 8px; border-left: 4px solid var(--marron); font-size: 0.95em;">
                            <strong>Respuesta del Administrador:</strong> ${dev.respuestaAdmin}
                        </p>
                    ` : ''}
                    
                    ${isPending ? `
                        <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; width: 100%;">
                            <textarea id="resp-${dev.idDevolucion}" placeholder="Escribe la respuesta/justificación para el cliente..." style="width: 100%; min-height: 60px; box-sizing: border-box; border-radius: 8px; padding: 8px; border: 1px solid var(--marron); font-family: inherit; font-size: 0.95em;" required></textarea>
                            <div style="display: flex; gap: 10px; width: 100%;">
                                <button class="btn btn--verde btn-aprobar" data-id="${dev.idDevolucion}" style="flex: 1; padding: 8px 15px; margin: 0; min-height: auto;">Aprobar</button>
                                <button class="btn btn--rojo btn-rechazar" data-id="${dev.idDevolucion}" style="flex: 1; padding: 8px 15px; margin: 0; min-height: auto;">Rechazar</button>
                            </div>
                        </div>
                    ` : ''}
                `;

                if (isPending) {
                    countPendientes++;
                    const btnAprobar = card.querySelector(".btn-aprobar");
                    const btnRechazar = card.querySelector(".btn-rechazar");
                    const textarea = card.querySelector(`#resp-${dev.idDevolucion}`);

                    btnAprobar.addEventListener("click", () => resolverDevolucion(usuario.idUsuario, dev.idDevolucion, "Aprobada", textarea.value.trim(), dev.idPedido));
                    btnRechazar.addEventListener("click", () => resolverDevolucion(usuario.idUsuario, dev.idDevolucion, "Rechazada", textarea.value.trim(), dev.idPedido));
                    pendientesContainer.appendChild(card);
                } else {
                    countProcesadas++;
                    procesadasContainer.appendChild(card);
                }
            });
        }

        if (countPendientes === 0) {
            pendientesContainer.innerHTML = "<p style='color: #666; font-style: italic; text-align: center; margin-top: 10px;'>No hay solicitudes de devolución pendientes.</p>";
        }
        if (countProcesadas === 0) {
            procesadasContainer.innerHTML = "<p style='color: #666; font-style: italic; text-align: center; margin-top: 10px;'>No hay solicitudes de devolución procesadas históricas.</p>";
        }
    } catch (error) {
        console.error("Error al cargar devoluciones del administrador:", error);
        pendientesContainer.innerHTML = "<p style='text-align: center;'>Error al conectar con el servidor para obtener las devoluciones.</p>";
    }
}

/**
 * Realiza el envío HTTP POST al servlet para aprobar o rechazar una solicitud.
 * @param {string} idUsuario - ID del administrador.
 * @param {string} idDevolucion - ID de la devolución a resolver.
 * @param {string} estado - El nuevo estado asignado ('Aprobada' o 'Rechazada').
 * @param {string} respuesta - Texto explicativo del administrador.
 * @param {string} idPedido - ID del pedido.
 */
async function resolverDevolucion(idUsuario, idDevolucion, estado, respuesta, idPedido) {
    if (!respuesta) {
        alert("Por favor, escribe una justificación o respuesta para el cliente antes de procesar.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/turpialJava/devolucion?accion=responder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuario,
                idDevolucion,
                estado,
                respuestaAdmin: respuesta
            })
        });

        if (!response.ok) throw new Error("Error en la petición de red");

        const data = await response.json();
        if (data.status === "success") {
            alert(`Devolución ${idDevolucion} resuelta como: ${estado}`);
            
            // Registrar auditoría local y remota
            const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
            if (usuarioActivo && typeof guardarHistorial === "function") {
                guardarHistorial(usuarioActivo.email, "Administrador", `Resolvió devolución ${idDevolucion} para el pedido ${idPedido} como ${estado}. Respuesta: ${respuesta}`);
            }

            // Recargar listas dinámicas
            cargarDevoluciones(usuarioActivo);
        } else {
            alert("Error al procesar devolución: " + data.message);
        }
    } catch (error) {
        console.error("Error resolviendo devolución:", error);
        alert("Hubo un error de conexión al procesar la devolución.");
    }
}

function setupBackButton() {
    const backBtn = document.getElementById("backButton");
    if (!backBtn) return;
    backBtn.addEventListener("click", () => {
        window.location.href = "../homePage/homePage.html";
    });
}
