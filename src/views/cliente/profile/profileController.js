document.addEventListener(

    "DOMContentLoaded",

    () => {

        cargarPerfil();
        setupLogout();
    }
);

/**
 * Metodo que consulta
 * los datos actualizados
 * del usuario.
 */
function cargarPerfil() {

    /**
     * Recuperamos sesión.
     */

    const usuarioActivo =

        JSON.parse(

            localStorage.getItem(
                "usuarioActivo"
            )
        );

    /**
     * Validar login.
     */

    if (!usuarioActivo) {

        alert(
            "Debes iniciar sesión"
        );

        window.location.href =

            "../../auth/login/login.html";

        return;
    }

    /**
     * JSON backend.
     */

    const data = {

        idUsuario:
            usuarioActivo.idUsuario
    };

    /**
     * Fetch backend.
     */

    fetch(

        "http://localhost:8080/turpialJava/UsuarioServlet?accion=readUser",

        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(data)
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Error servidor"
            );
        }

        return response.json();
    })

    .then(data => {

        console.log(data);

        /**
         * Validar respuesta.
         */

        if (

            data.status ===
            "success"

        ) {

            /**
             * Mostrar datos
             * en HTML.
             */

            document.querySelector(
                "#profileName"
            ).textContent =

                data.name;

            document.querySelector(
                "#profileEmail"
            ).textContent =

                data.email;

            document.querySelector(
                "#profilePhone"
            ).textContent =

                data.phone;

            document.querySelector(
                "#profileEstado"
            ).textContent =

                data.estado;
        }

        else {

            alert(
                data.message
            );
        }
    })

    .catch(error => {

        console.error(error);

        alert(
            "Error conexión"
        );
    });
}

function setupLogout() {
    const logoutBtn = document.querySelector("#logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
        if (usuarioActivo && typeof guardarHistorial === "function") {
            guardarHistorial(usuarioActivo.email, "Usuario", "Cerró sesión");
        }
        localStorage.removeItem("usuarioActivo");
        alert("Sesión cerrada");
        window.location.href = "../../auth/login/login.html";
    });
}