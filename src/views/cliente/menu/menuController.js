document.addEventListener("DOMContentLoaded", () => {

    validateSession();

    loadUserInitial();

});

function validateSession() {

    const user = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!user) {
        window.location.href = "../../../auth/login/login.html";
    }
}

function loadUserInitial() {

    const user = JSON.parse(localStorage.getItem("usuarioActivo"));

    const userButton = document.querySelector(".categories__usuario");

    if (user && userButton) {
        userButton.textContent = user.name.charAt(0).toUpperCase();
    }
}
