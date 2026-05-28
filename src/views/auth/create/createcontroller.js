document.addEventListener("DOMContentLoaded", () => {

    setupRegister();

});


function setupRegister() {

    const formulario =
        document.querySelector("#registroForm");


    if (!formulario) return;


    formulario.addEventListener("submit", (e) => {

        e.preventDefault();


        // OBTENER DATOS
        const name =
            document.querySelector("#nombre")
            .value
            .trim();

        const email =
            document.querySelector("#correo")
            .value
            .trim();

        const phone =
            document.querySelector("#telefono")
            .value
            .trim();

        const password =
            document.querySelector("#contraseña")
            .value
            .trim();


        // VALIDAR CAMPOS
        if (!name || !email || !phone || !password) {

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


        // VALIDAR TELÉFONO
        const phoneRegex =
        /^[0-9]{10}$/;


        if (!phoneRegex.test(phone)) {

            alert("El teléfono debe tener 10 números");

            return;
        }


        // VALIDAR PASSWORD
        if (password.length < 6) {

            alert("La contraseña debe tener mínimo 6 caracteres");

            return;
        }


        // OBTENER USUARIOS
        let usuarios =
            JSON.parse(localStorage.getItem("usuarios"))
            || [];


        // VALIDAR SI YA EXISTE
        const usuarioExistente =
            usuarios.find(
                usuario => usuario.email === email
            );


        if (usuarioExistente) {

            alert("El correo ya está registrado");

            return;
        }


        // CREAR USUARIO
        const newUser = {

        name:
            document.querySelector('#name').value,

        email:
            document.querySelector('#email').value,

        phone:
            document.querySelector('#phone').value,

        password:
            document.querySelector('#password').value,

        role: 'ROL-003',

        status: 'active',

        registerDate:
            new Date().toISOString().split('T')[0]

};


        // GUARDAR
        usuarios.push(nuevoUsuario);


        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );


        alert("Usuario registrado correctamente");


        // REDIRIGIR LOGIN
        window.location.href =
            "../login/login.html";

    });

}