document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderActivities();
    setupBackButton();
});

async function fetchAndRenderActivities() {
    const container = document.querySelector("#activityList");
    if (!container) return;

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
        alert("Debes iniciar sesión para ver tu historial de actividades.");
        window.location.href = "../../auth/login/login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/turpialJava/auditoria?accion=listar&idUsuario=${usuarioActivo.idUsuario}`);
        if (!response.ok) throw new Error();

        const data = await response.json();
        container.innerHTML = "";

        if (data.status === "success" && data.activities && data.activities.length > 0) {
            data.activities.forEach(act => {
                container.innerHTML += `
                    <div class="section" style="width: 100%; max-width: 450px; text-align: left; padding: 15px; margin: 0 auto; display: flex; flex-direction: column; gap: 5px; min-height: auto;">
                        <h3 style="margin: 0; color: var(--marron); font-size: 1.1em;">Acción: ${act.tipoAccion}</h3>
                        <p style="margin: 2px 0;"><strong>Descripción:</strong> ${act.accion}</p>
                        <p style="margin: 2px 0; font-size: 0.9em; color: #666;"><strong>Fecha:</strong> ${act.fecha}</p>
                    </div>
                `;
            });
        } else {
            container.innerHTML = "<p class='order-history__empty'>No hay actividades registradas en tu historial.</p>";
        }
    } catch (error) {
        console.error("Error al cargar auditoría:", error);
        container.innerHTML = "<p>Error al conectar con el servidor para obtener el historial de actividades.</p>";
    }
}

function setupBackButton() {
    const backBtn = document.querySelector("#backButton");
    if (!backBtn) return;
    backBtn.addEventListener("click", () => {
        window.location.href = "../profile/profile.html";
    });
}
