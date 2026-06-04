document.addEventListener("DOMContentLoaded", () => {

    setupNewPassword();

});


function setupNewPassword() {

    const form =
        document.querySelector("#newPasswordForm");


    if (!form) return;


    form.addEventListener("submit", (e) => {

        e.preventDefault();


        // OBTENER PASSWORDS
        const newPassword =
            document.querySelector("#newPassword")
            .value
            .trim();

        const confirmPassword =
            document.querySelector("#confirmPassword")
            .value
            .trim();


        // VALIDAR CAMPOS
        if (!newPassword || !confirmPassword) {

            alert("Todos los campos son obligatorios");

            return;
        }


        // VALIDAR LONGITUD
        if (newPassword.length < 6) {

            alert(
                "La contraseña debe tener mínimo 6 caracteres"
            );

            return;
        }


        // VALIDAR COINCIDENCIA
        if (newPassword !== confirmPassword) {

            alert("Las contraseñas no coinciden");

            return;
        }


        // OBTENER EMAIL RECUPERACIÓN
        const recoveryEmail =
            localStorage.getItem("recoveryEmail");


        if (!recoveryEmail) {

            alert(
                "No hay proceso de recuperación activo"
            );

            return;
        }


        // Enviar petición al backend para restablecer la contraseña
        const payload = {
            email: recoveryEmail,
            newPassword: newPassword
        };

        fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=resetPassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                // LIMPIAR DATOS TEMPORALES
                localStorage.removeItem("recoveryCode");
                localStorage.removeItem("recoveryEmail");

                alert("Contraseña actualizada correctamente");

                // REDIRECCIONAR LOGIN
                window.location.href = "../login/login.html";
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error al restablecer contraseña:", error);
            alert("No se pudo conectar con el servidor de El Turpial.");
        });

    });

}