export async function deleteEmployee(id) {

const usuarioActivo = JSON.parse(

    localStorage.getItem("usuarioActivo")

);

if (usuarioActivo.idUsuario === id) {

    alert("No puedes eliminar tu propia cuenta");
    return;
}

    const confirmDelete = confirm("¿Seguro que quieres eliminar este empleado?");


    if (!confirmDelete) return;

    try {
        const response = await fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=deleteEmployee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id })
        });

        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const data = await response.json();
        if (data.status === "success") {
            alert("Empleado eliminado correctamente");
            location.reload();
        } else {
            alert("Error al eliminar: " + data.message);
        }
    } catch (error) {
        console.error("Error al eliminar empleado:", error);
        alert("No se pudo conectar con el servidor.");
    }

}