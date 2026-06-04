// Controlador para la vista de cambio de contraseña del cliente
document.addEventListener("DOMContentLoaded",() => {
        setupChangePassword();
    }
);

// Controlador para la vista de cambio de contraseña del cliente
function setupChangePassword() {

    const formulario =document.querySelector("#changePasswordForm");

    if (!formulario) return;

    formulario.addEventListener("submit",(e) => {

            e.preventDefault();

            // Se recupera el usuario activo de localStorage para obtener su idUsuario
            const usuarioActivo =JSON.parse(localStorage.getItem("usuarioActivo")
                );

            // Validamos existencia
            const currentPassword =document.querySelector("#currentPassword").value.trim();

            const newPassword =document.querySelector("#newPassword").value.trim();

            const confirmPassword =document.querySelector("#confirmPassword").value.trim();

            // Validaciones básicas
            if (!currentPassword || !newPassword || !confirmPassword) {

                alert("Todos los campos son obligatorios");
                return;
            }

            if (newPassword !==confirmPassword) {

                alert("Las contraseñas no coinciden");
                return;
            }

            if (newPassword.length < 6) {

                alert("Mínimo 6 caracteres");
                return;
            }

            // Preparamos datos para el backend
            const passwordData = {
                idUsuario:usuarioActivo.idUsuario,
                currentPassword,
                newPassword
            };

            // Enviamos al backend
            fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=changePassword",

                {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify(passwordData)
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

                if (data.status ==="success") {

                    alert("Contraseña actualizada");
                    window.location.href ="../profile/profile.html";
                }

                else {

                    alert(data.message);
                }
            })

            .catch(error => {

                console.error(error);

                alert("Error conexión");
            });
        }
    );
}