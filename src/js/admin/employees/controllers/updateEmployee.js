export async function updateEmployee(id) {
    try {
        const readResponse = await fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=readUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idUsuario: id })
        });
        if (!readResponse.ok) {
            throw new Error("Error al consultar el empleado");
        }
        const employeeData = await readResponse.json();
        if (employeeData.status !== "success") {
            alert("No se encontró el empleado");
            return;
        }

        const newName = prompt("Nuevo nombre", employeeData.name);
        if (!newName) return;

        const newEmail = prompt("Nuevo correo", employeeData.email);
        if (!newEmail) return;

        let currentRoleFriendly = employeeData.idRol === "ROL-001" ? "Administrador" : "Empleado";
        const newRole = prompt("Nuevo cargo (Administrador / Empleado)", currentRoleFriendly);
        if (!newRole) return;

        const newStatus = prompt("Estado (Activo / Inactivo)", employeeData.estado);
        if (!newStatus) return;

        const payload = {
            id: id,
            name: newName,
            email: newEmail,
            role: newRole,
            status: newStatus
        };

        const updateResponse = await fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=updateEmployee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!updateResponse.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const updateData = await updateResponse.json();
        if (updateData.status === "success") {
            alert("Empleado actualizado correctamente");
            location.reload();
        } else {
            alert("Error al actualizar: " + updateData.message);
        }
    } catch (error) {
        console.error("Error al actualizar empleado:", error);
        alert("No se pudo conectar con el servidor.");
    }
}