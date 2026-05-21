document.addEventListener("DOMContentLoaded", () => {

    setupPasswordChange();

});


function setupPasswordChange() {

    const form = document.getElementById("cambioForm");

    if (!form) return;


    form.addEventListener("submit", (e) => {

        e.preventDefault();


        const currentPassword =
            document.getElementById("contraseñaActual").value.trim();

        const newPassword =
            document.getElementById("nuevaContraseña").value.trim();

        const confirmPassword =
            document.getElementById("confirmarContraseña").value.trim();


        // VALIDAR CAMPOS VACÍOS
        if (!currentPassword || !newPassword || !confirmPassword) {

            alert("Todos los campos son obligatorios");

            return;
        }


        // VALIDAR LONGITUD
        if (newPassword.length < 6) {

            alert("La nueva contraseña debe tener mínimo 6 caracteres");

            return;
        }


        // VALIDAR COINCIDENCIA
        if (newPassword !== confirmPassword) {

            alert("Las contraseñas no coinciden");

            return;
        }


        // OBTENER USUARIO
        const user =
            JSON.parse(localStorage.getItem("user")) || {};


        // VALIDAR CONTRASEÑA ACTUAL
        if (user.password !== currentPassword) {

            alert("La contraseña actual es incorrecta");

            return;
        }


        // ACTUALIZAR CONTRASEÑA
        user.password = newPassword;


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        alert("Contraseña actualizada correctamente");


        // REDIRIGIR LOGIN
        window.location.href =
            "../../auth/login/login.html";

    });

}