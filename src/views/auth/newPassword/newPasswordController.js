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


        // OBTENER USUARIOS
        let usuarios =
            JSON.parse(localStorage.getItem("usuarios"))
            || [];


        // BUSCAR USUARIO
        const usuarioIndex =
            usuarios.findIndex(
                usuario =>
                    usuario.email === recoveryEmail
            );


        if (usuarioIndex === -1) {

            alert("Usuario no encontrado");

            return;
        }


        // ACTUALIZAR PASSWORD
        usuarios[usuarioIndex].password =
            newPassword;


        // GUARDAR CAMBIOS
        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );


        // LIMPIAR DATOS TEMPORALES
        localStorage.removeItem("recoveryCode");

        localStorage.removeItem("recoveryEmail");


        alert("Contraseña actualizada correctamente");


        // REDIRECCIONAR LOGIN
        window.location.href =
            "../login/login.html";

    });

}