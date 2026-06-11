// Controlador para la vista de edición de perfil del cliente
document.addEventListener("DOMContentLoaded",() => {
        cargarDatosUsuario();
        setupUpdateProfile();
    }
);

// Metodo que carga los datos del usuario activo en el formulario para su edición
function cargarDatosUsuario() {

    // Obtenemos usuario activo
    const usuarioActivo = JSON.parse(

        localStorage.getItem("usuarioActivo")
    );

    // Validamos existencia
    if (!usuarioActivo) {

        alert("Debes iniciar sesión");

        window.location.href ="../../auth/login/login.html";

        return;
    }

    // Cargamos datos en el formulario
    document.querySelector("#name").value = usuarioActivo.name;
    document.querySelector("#email").value = usuarioActivo.email;
    document.querySelector("#phone").value = usuarioActivo.phone;
    document.querySelector("#direccion").value = usuarioActivo.direccion || "";
}

// Metodo que configura el submit del formulario para actualizar los datos del usuario
function setupUpdateProfile() {

    const formulario =document.querySelector("#editProfileForm");

    if (!formulario) return;

    formulario.addEventListener("submit",(e) => {
            e.preventDefault();

            //Se recupera el usuario activo de localStorage para obtener su idUsuario
            const usuarioActivo =JSON.parse(localStorage.getItem("usuarioActivo"));

            //se capturan los datos del formulario
            const name =document.querySelector("#name").value.trim();
            const email =document.querySelector("#email").value.trim();
            const phone =document.querySelector("#phone").value.trim();
            const direccion =document.querySelector("#direccion").value.trim();

            //validaciones básicas
            if (
                !name ||
                !email ||
                !phone ||
                !direccion
            ) {

                alert(
                    "Todos los campos son obligatorios"
                );
                return;
            }

            //Se crea el objeto json para enviar al backend.
            const usuarioData = {
                idUsuario: usuarioActivo.idUsuario,
                name,
                email,
                phone,
                direccion
            };

            // peticion al fetch al servlet java para actualizar datos
            fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=update",

                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(usuarioData)
                }
            )

            .then(response => {

                if (!response.ok) {
                    throw new Error("Error servidor");
                }

                return response.json();
            })

            .then(data => {

                console.log(data);

                //Se valida la respuesta del backend
                if (
                    data.status ==="success"
                ) {

                    //Actualizamos localStorage con los nuevos datos
                    usuarioActivo.name =name;

                    usuarioActivo.email =email;

                    usuarioActivo.phone =phone;

                    usuarioActivo.direccion =direccion;

                    localStorage.setItem("usuarioActivo",JSON.stringify(usuarioActivo));

                    alert("Perfil actualizado");

                    // Redireccionamos nuevamente al perfil

                    window.location.href ="../profile/profile.html";
                }

                else {
                    alert(data.message);
                }
            })

            .catch(error => {

                console.error(error);

                alert(
                    "Error de conexión"
                );
            });
        }
    );
}