const changePasswordForm =

document.querySelector(
    "#changePasswordForm"
);


console.log(changePasswordForm);


changePasswordForm.addEventListener(
    "submit",

    (e) => {

        e.preventDefault();

        console.log("submit password");


        const currentPassword =

            document.querySelector(
                "#currentPassword"
            ).value;


        const newPassword =

            document.querySelector(
                "#newPassword"
            ).value;


        const confirmPassword =

            document.querySelector(
                "#confirmPassword"
            ).value;


        const usuarioActivo =

            JSON.parse(

                localStorage.getItem(
                    "usuarioActivo"
                )

            );


        let usuarios =

            JSON.parse(

                localStorage.getItem(
                    "usuarios"
                )

            ) || [];


        console.log(usuarioActivo);


        if (
            usuarioActivo.password !==
            currentPassword
        ) {

            alert(
                "Contraseña actual incorrecta"
            );

            return;

        }


        if (
            newPassword !==
            confirmPassword
        ) {

            alert(
                "Las contraseñas no coinciden"
            );

            return;

        }


        usuarioActivo.password =
            newPassword;


        usuarios = usuarios.map(usuario =>

            usuario.email ===
            usuarioActivo.email

                ? usuarioActivo

                : usuario
        );


        localStorage.setItem(

            "usuarios",

            JSON.stringify(usuarios)

        );


        localStorage.setItem(

            "usuarioActivo",

            JSON.stringify(usuarioActivo)

        );


        alert(
            "Contraseña actualizada"
        );


        window.location.href =
            "../profile/profile.html";

    }
);