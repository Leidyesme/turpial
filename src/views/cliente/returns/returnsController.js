document.addEventListener("DOMContentLoaded", () => {

    setupReturns();

    renderReturns();

});

function setupReturns() {

    const form =
        document.querySelector("#returnsForm");

    if (!form) return;

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const pedido =
            document.querySelector("#pedido")
            .value
            .trim();

        const producto =
            document.querySelector("#producto")
            .value;

        const valor =
            document.querySelector("#valor")
            .value;

        const motivo =
            document.querySelector("#motivo")
            .value
            .trim();

        if (
            !pedido ||
            !producto ||
            !valor ||
            !motivo
        ) {

            alert(
                "Todos los campos son obligatorios"
            );

            return;
        }

        const devolucion = {

            id:
                Date.now(),

            pedido,

            producto,

            valor,

            motivo,

            fecha:
                new Date().toLocaleDateString(),

            estado:
                "Reembolsado"

        };

        const devoluciones =
            JSON.parse(
                localStorage.getItem("devoluciones")
            ) || [];

        devoluciones.push(devolucion);

        localStorage.setItem(
            "devoluciones",
            JSON.stringify(devoluciones)
        );

        guardarHistorial(
            "Cliente",
            "Cliente",
            "Registró devolución"
        );

        alert(
            "Devolución registrada correctamente"
        );

        form.reset();

        renderReturns();

    });

}

function renderReturns() {

    const container =
        document.querySelector(
            "#listaDevoluciones"
        );

    if (!container) return;

    const devoluciones =
        JSON.parse(
            localStorage.getItem("devoluciones")
        ) || [];

    container.innerHTML = "";

    devoluciones.forEach(devolucion => {

        container.innerHTML += `

            <div class="section">

                <h3>
                    Pedido:
                    ${devolucion.pedido}
                </h3>

                <p>
                    Producto:
                    ${devolucion.producto}
                </p>

                <p>
                    Reembolso:
                    $${devolucion.valor}
                </p>

                <p>
                    Motivo:
                    ${devolucion.motivo}
                </p>

                <p>
                    Fecha:
                    ${devolucion.fecha}
                </p>

                <button class="btn btn--verde">

                    ${devolucion.estado}

                </button>

            </div>

        `;

    });

}
