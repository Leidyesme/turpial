document.addEventListener("DOMContentLoaded", () => {

    loadUserData();

    setupLogout();

});


function loadUserData() {

    // OBTENER USUARIO ACTIVO
    const activeUser =
        JSON.parse(
            localStorage.getItem("activeUser")
        );


    // VALIDAR SESIÓN
    if (!activeUser) {

        alert("You must log in");

        window.location.href =
            "../../auth/login/login.html";

        return;
    }


    // ELEMENTOS HTML
    const name =
        document.querySelector(".profile__name");

    const email =
        document.querySelector(".profile__email");

    const initial =
        document.querySelector(".profile__usuario");


    // MOSTRAR DATOS
    if (name) {

        name.textContent =
            activeUser.name;

    }


    if (email) {

        email.textContent =
            activeUser.email;

    }


    if (initial) {

        initial.textContent =
            activeUser.name
            .charAt(0)
            .toUpperCase();

    }

}


function setupLogout() {

    const logoutBtn =
        document.querySelector("#logoutBtn");


    if (!logoutBtn) return;


    logoutBtn.addEventListener("click", () => {

        // ELIMINAR SESIÓN
        localStorage.removeItem(
            "activeUser"
        );


        alert("Session closed");


        // REDIRECCIONAR
        window.location.href =
            "../../auth/login/login.html";

    });

}