document.addEventListener("DOMContentLoaded", () => {

    renderHistory();

});

function renderHistory() {

    const container =
        document.querySelector("#historyList");

    if (!container) return;

    const historial =
        JSON.parse(
            localStorage.getItem("historial")
        ) || [];

    container.innerHTML = "";

    historial.forEach(item => {

        container.innerHTML += `

            <div class="section">

                <h3>
                    ${item.usuario}
                </h3>

                <p>
                    Rol:
                    ${item.rol}
                </p>

                <p>
                    Acción:
                    ${item.accion}
                </p>

                <p>
                    Fecha:
                    ${item.fecha}
                </p>

            </div>

        `;

    });

}
