document.addEventListener("DOMContentLoaded", () => {

    setupLogin();

});


function setupLogin() {

    const loginForm =
        document.querySelector("#login__Form");


    if (!loginForm) return;


    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();


        const email =
            document.querySelector("#email")
            .value
            .trim();

        const password =
            document.querySelector("#contraseña")
            .value
            .trim();


        // VALIDAR CAMPOS
        if (!email || !password) {

            alert("Todos los campos son obligatorios");

            return;
        }


        // VALIDAR EMAIL
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
        const usuarioEncontrado =
            usuarios.find(usuario =>

                usuario.email === email &&
                usuario.password === password
            );


        // VALIDAR USUARIO
        if (!usuarioEncontrado) {

            alert("Correo o contraseña incorrectos");

            return;
        }


        // GUARDAR SESIÓN
        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(usuarioEncontrado)
        );


        alert("Bienvenido");


        // REDIRECCIÓN SEGÚN ROL
        switch (usuarioEncontrado.rol) {

            case "cliente":

                window.location.href =
                "../../cliente/categories/categories.html";

                break;


            case "admin":

                window.location.href =
                "../../manager/homePage/homePage.html";

                break;


            case "empleado":

                window.location.href =
                "../../employee/orders/orders.html";

                break;


            default:

                window.location.href =
                "../../cliente/categories/categories.html";
        }

    });

}