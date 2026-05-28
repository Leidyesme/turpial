document.addEventListener("DOMContentLoaded", () => {

    loadUserData();

    setupLogout();

});


function loadUserData() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "usuarioActivo"
            )
        );


    if (!user) {

        window.location.href =
            "../../../../views/auth/login/login.html";

        return;

    }


    const name =
        document.querySelector(".profile__name");

    const email =
        document.querySelector(".profile__email");

    const initial =
        document.querySelector(".profile__usuario");


    if (name) {

        name.textContent =
            user.name;

    }


    if (email) {

        email.textContent =
            user.email;

    }


    if (initial) {

        initial.textContent =
            user.name.charAt(0)
            .toUpperCase();

    }

}


function setupLogout() {

    const logoutBtn =
        document.querySelector(
            "#logoutBtn"
        );


    if (!logoutBtn) return;


    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem(
            "usuarioActivo"
        );


        window.location.href =
            "../../../../views/auth/login/login.html";

    });

}