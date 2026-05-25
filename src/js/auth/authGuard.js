document.addEventListener("DOMContentLoaded", () => {

    checkAuthentication();

});


function checkAuthentication() {

    // OBTENER USUARIO ACTIVO
    const activeUser =
        JSON.parse(
            localStorage.getItem("activeUser")
        );


    // VALIDAR SESIÓN
    if (!activeUser) {

        alert("You must log in");


        // REDIRECCIONAR LOGIN
        window.location.href =
            "../../auth/login/login.html";

    }

}