import {
    getEmployees,
    saveEmployees
}
from "../services/employeeService.js";


import {
    generateEmployeeId
}
from "../helpers/generateEmployeeId.js";


export function setupAddEmployee(loadEmployees) {

    const form = document.querySelector("#employeeForm");
    if (!form) return;



    form.addEventListener(
        "submit",

        async (e) => {

            e.preventDefault();

            const payload = {
            name: document.querySelector("#employeeName").value.trim(),
            email: document.querySelector("#employeeEmail").value.trim(),
            phone: document.querySelector("#employeePhone").value.trim(),
            direccion: document.querySelector("#employeeAddress").value.trim(),
            password: document.querySelector("#employeePassword").value.trim(),
            role: document.querySelector("#employeeRole").value
        };

        // Validación básica
        if (!payload.name || !payload.email || !payload.phone || !payload.direccion || !payload.password || !payload.role) {
            alert("Todos los campos son obligatorios");
            return;
        }

        if (payload.password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=createEmployee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            // Convertimos la respuesta a JSON
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                // Si el servidor falla (ej. 409 Conflict), usamos el mensaje del backend
                throw new Error(data.message || "Error en el servidor al guardar el empleado");
            }

            if (data.status === "success") {
                alert("Empleado agregado correctamente");
                form.reset();
                loadEmployees(); // Refresca la tabla
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error al crear empleado:", error);
            alert("Error: " + error.message);
        }
    });
}