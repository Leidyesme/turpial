document.addEventListener("DOMContentLoaded", () => {

    setupChangePassword();

});


function setupChangePassword() {

    const form =
        document.querySelector("#cambioForm");


    if (!form) return;


    form.addEventListener("submit", (e) => {

        e.preventDefault();


        // USUARIO ACTIVO
        let activeUser =
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


        // USERS
        let users =
            JSON.parse(
                localStorage.getItem("users")
            )
            || [];


        // INPUTS
        const currentPassword =
            document.querySelector(
                "#contraseñaActual"
            ).value;

        const newPassword =
            document.querySelector(
                "#nuevaContraseña"
            ).value;

        const confirmPassword =
            document.querySelector(
                "#confirmarContraseña"
            ).value;


        // VALIDAR PASSWORD ACTUAL
        if (
            currentPassword !==
            activeUser.password
        ) {

            alert(
                "Current password is incorrect"
            );

            return;

        }


        // VALIDAR NUEVA PASSWORD
        if (
            newPassword.length < 6
        ) {

            alert(
                "Password must have at least 6 characters"
            );

            return;

        }


        // VALIDAR CONFIRMACIÓN
        if (
            newPassword !== confirmPassword
        ) {

            alert(
                "Passwords do not match"
            );

            return;

        }


        // ACTUALIZAR PASSWORD
        activeUser.password =
            newPassword;


        // ACTUALIZAR USERS
        users = users.map((user) => {

            if (
                user.email ===
                activeUser.email
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


        alert(
            "Password updated successfully"
        );


        // REDIRECCIONAR
        window.location.href =
            "../profile/profile.html";

    });

}