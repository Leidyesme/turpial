const editForm =
document.querySelector(
    "#editProfileForm"
);

document.addEventListener(
    "DOMContentLoaded",

    () => {

        loadUserData();

    }
);


function loadUserData() {

    const usuarioActivo =

        JSON.parse(

            localStorage.getItem(
                "usuarioActivo"
            )

        );


    console.log(usuarioActivo);


    if (!usuarioActivo) return;


    document.querySelector("#name").value =

        usuarioActivo.name || "";


    document.querySelector("#email").value =

        usuarioActivo.email || "";


    document.querySelector("#phone").value =

        usuarioActivo.phone || "";

}


editForm.addEventListener(
    "submit",

    (e) => {

        e.preventDefault();

        console.log("submit edit profile");


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


        const oldEmail =
            usuarioActivo.email;


        usuarioActivo.name =

            document.querySelector(
                "#name"
            ).value;


        usuarioActivo.email =

            document.querySelector(
                "#email"
            ).value;


        usuarioActivo.phone =

            document.querySelector(
                "#phone"
            ).value;


        usuarios = usuarios.map(usuario =>

            usuario.email === oldEmail

                ? usuarioActivo

                : usuario
        );


        console.log(usuarios);


        localStorage.setItem(

            "usuarios",

            JSON.stringify(usuarios)

        );


        localStorage.setItem(

            "usuarioActivo",

            JSON.stringify(usuarioActivo)

        );


        alert(
            "Perfil actualizado"
        );


        window.location.href =
            "../profile/profile.html";

    }
);