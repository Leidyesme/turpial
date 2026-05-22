document.addEventListener("DOMContentLoaded", () => {

    setupRecoverPassword();

});


function setupRecoverPassword() {

    const recoverForm =
        document.querySelector("#recoverForm");


    if (!recoverForm) return;


    recoverForm.addEventListener("submit", (e) => {

        e.preventDefault();


        // OBTENER EMAIL
        const email =
            document.querySelector("#email")
            .value
            .trim();


        // VALIDAR CAMPO
        if (!email) {

            alert("El correo es obligatorio");

            return;
        }


        // VALIDAR FORMATO EMAIL
        const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

            alert("Correo inválido");

            return;
        }


        // OBTENER USUARIOS
        const usuarios =
            JSON.parse(localStorage.getItem("usuarios"))
            || [];


        // BUSCAR USUARIO
        const usuarioExiste =
            usuarios.find(
                usuario => usuario.email === email
            );


        // VALIDAR EXISTENCIA
        if (!usuarioExiste) {

            alert("El correo no está registrado");

            return;
        }


        // GUARDAR EMAIL TEMPORAL
        localStorage.setItem(
            "recoveryEmail",
            email
        );


        alert("Correo verificado correctamente");

        const recoveryCode =
        Math.floor(100000 + Math.random() * 900000);

        localStorage.setItem(
            "recoveryCode",
            recoveryCode
        );

        // REDIRECCIONAR
        window.location.href =
            "../codepassword/codepassword.html";

    });

}