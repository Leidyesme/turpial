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

    const form =
        document.querySelector(
            "#employeeForm"
        );


    form.addEventListener(
        "submit",

        async (e) => {

            e.preventDefault();


            const name =
                document.querySelector(
                    "#employeeName"
                ).value;


            const email =
                document.querySelector(
                    "#employeeEmail"
                ).value;


            const role =
                document.querySelector(
                    "#employeeRole"
                ).value;


            const payload = {
                name,
                email,
                role
            };

            try {
                const response = await fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=createEmployee", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }

                const data = await response.json();
                if (data.status === "success") {
                    alert("Empleado agregado correctamente");
                    form.reset();
                    loadEmployees();
                } else {
                    alert("Error al guardar: " + data.message);
                }
            } catch (error) {
                console.error("Error al crear empleado:", error);
                alert("No se pudo conectar con el servidor.");
            }
        }
    );

}