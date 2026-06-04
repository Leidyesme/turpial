document.addEventListener("DOMContentLoaded", () => {
    setupRegister();
});

function setupRegister() {
    const formulario = document.querySelector("#registroForm");
    if (!formulario) return;

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        // OBTENER DATOS 
        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const phone = document.querySelector("#phone").value.trim();
        const password = document.querySelector("#password").value.trim();

        // VALIDACIONES DE CAMPOS
        if (!name || !email || !phone || !password) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Correo inválido");
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            alert("El teléfono debe tener 10 números");
            return;
        }

        if (password.length < 6) {
            alert("La contraseña debe tener mínimo 6 caracteres");
            return;
        }

        //  CREAR EL OBJETO JSON CON LA ESTRUCTURA QUE RECIBIRÁ JAVA
        const usuarioData = {
            name,
            email,
            phone,
            password,
            idRol: 3,          // ROL-003 correspondiente a Cliente
            estado: "Activo"   // Estado inicial por defecto de tu ENUM
        };

        // ENVIAR LA PETICIÓN HTTP AL BACKEND (Tomcat)
        fetch("http://localhost:8080/turpialJava/PruebaServlet?accion=create", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(usuarioData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json(); // Esperamos una respuesta JSON del servlet
        })
        .then(data => {

            console.log(data);
            
            // Evaluamos la respuesta enviada por Java
            if (data.status === "success") {
                alert("¡Usuario registrado correctamente en la Base de Datos!");
                window.location.href = "../login/login.html";
            } else {
                alert("Error al registrar: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error en la conexión:", error);
            alert("No se pudo conectar con el servidor de El Turpial. Asegúrate de que Tomcat esté corriendo.");
        });
    });
}