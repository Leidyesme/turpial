const loginForm =

document.querySelector(
    "#login__Form"
);


loginForm.addEventListener(
    "submit",

    (e) => {

        e.preventDefault();


        const email =

            document.querySelector(
                "#email"
            ).value;


        const password =

            document.querySelector(
                "#password"
            ).value;


        const usuarios =

            JSON.parse(

                localStorage.getItem(
                    "usuarios"
                )

            ) || [];


        const usuarioEncontrado =

            usuarios.find(usuario =>

                usuario.email === email &&

                usuario.password === password
            );


        if (!usuarioEncontrado) {

            alert(
                "Correo o contraseña incorrectos"
            );

            return;

        }


        localStorage.setItem(

            "usuarioActivo",

            JSON.stringify(
                usuarioEncontrado
            )

        );


        alert(
            "Inicio de sesión exitoso"
        );


        window.location.href =

            "../../client/categories/categories.html";

    }
);