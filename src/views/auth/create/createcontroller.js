document.addEventListener("DOMContentLoaded", () => {
    setupRegister();
});

function setupRegister() {
    const formulario = document.querySelector("#registroForm");
    if (!formulario) return; // Si no existe el formulario en la página, salimos.

    formulario.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario.

        // OBTENER DATOS DEL DOM
        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const phone = document.querySelector("#phone").value.trim();
        const direccion = document.querySelector("#direccion").value.trim();
        const password = document.querySelector("#password").value.trim();

        // VALIDACIONES DE CAMPOS EN LA PARTE DEL CLIENTE
        if (!name || !email || !phone || !direccion || !password) {
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
            direccion,
            idRol: 3,          // ROL-003 correspondiente a Cliente
            estado: "Activo"   // Estado inicial por defecto de tu ENUM
        };

        // ENVIAR LA PETICIÓN HTTP AL BACKEND (Tomcat)
        fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=create", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(usuarioData)
        })
        .then(async response => {
            // Convertimos la respuesta a JSON (usamos async para manejar promesas)
            const data = await response.json().catch(() => ({})); 

            // Si el código HTTP no es 200-299, lanzamos error usando el mensaje del JSON
            if (!response.ok) {
                throw new Error(data.message || "Error desconocido en el servidor");
            }
            return data;
        })
        .then(data => {
            // Proceso cuando el servidor responde correctamente (status 200)
            console.log("Respuesta del servidor:", data);
            
            if (data.status === "success") {
                alert("¡Usuario registrado correctamente en la Base de Datos!");
                window.location.href = "../login/login.html";
            } else {
                // Caso donde el servidor llega, pero detecta error (ej. email duplicado)
                alert("Error al registrar: " + data.message);
            }
        })
        .catch(error => {
            // Captura errores de conexión o el error lanzado anteriormente
            console.error("Error en la conexión:", error);
            alert("Error: " + error.message);
        });
    });
}