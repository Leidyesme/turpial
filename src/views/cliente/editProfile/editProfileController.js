document.addEventListener("DOMContentLoaded", () => {

    loadUserData();

    setupEditProfile();

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


    // INPUTS
    const nameInput =
        document.querySelector("#name");

    const emailInput =
        document.querySelector("#email");

    const phoneInput =
        document.querySelector("#phone");


    // CARGAR DATOS
    if (nameInput) {

        nameInput.value =
            activeUser.name;

    }


    if (emailInput) {

        emailInput.value =
            activeUser.email;

    }


    if (phoneInput) {

        phoneInput.value =
            activeUser.phone;

    }

}


function setupEditProfile() {

    const form =
        document.querySelector(".editprofile__form");


    if (!form) return;


    form.addEventListener("submit", (e) => {

        e.preventDefault();


        // OBTENER USUARIO ACTIVO
        let activeUser =
            JSON.parse(
                localStorage.getItem("activeUser")
            );


        // OBTENER USERS
        let users =
            JSON.parse(
                localStorage.getItem("users")
            )
            || [];


        // NUEVOS DATOS
        const updatedName =
            document.querySelector("#name").value;

        const updatedEmail =
            document.querySelector("#email").value;

        const updatedPhone =
            document.querySelector("#phone").value;


        // VALIDACIONES
        if (
            updatedName === "" ||
            updatedEmail === "" ||
            updatedPhone === ""
        ) {

            alert("Complete all fields");

            return;

        }


        // ACTUALIZAR ACTIVE USER
        activeUser.name =
            updatedName;

        activeUser.email =
            updatedEmail;

        activeUser.phone =
            updatedPhone;


        // ACTUALIZAR USERS ARRAY
        users = users.map((user) => {

            if (
                user.email === activeUser.email
            ) {

                return activeUser;

            }

            return user;

        });


        // GUARDAR
        localStorage.setItem(
            "activeUser",
            JSON.stringify(activeUser)
        );


        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        alert("Profile updated successfully");


        // REDIRECCIONAR
        window.location.href =
            "../profile/profile.html";

    });

}