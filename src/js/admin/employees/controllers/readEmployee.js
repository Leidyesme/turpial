import {
    updateEmployee
}
from "./updateEmployee.js";


import {
    deleteEmployee
}
from "./deleteEmployee.js";


export async function loadEmployees() {
    try {
        const response = await fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=listEmployees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }
        const data = await response.json();
        if (data.status === "success") {
            renderEmployees(data.employees || []);
        } else {
            alert("Error al cargar empleados: " + data.message);
        }
    } catch (error) {
        console.error("Error al cargar empleados:", error);
        alert("No se pudo conectar con el servidor para obtener la lista de empleados.");
    }
}


function renderEmployees(employees) {

    const container =
        document.querySelector(
            "#employeesContainer"
        );


    container.innerHTML = "";


    if (employees.length === 0) {

        container.innerHTML = `

            <p class="employees__empty">

                No hay empleados registrados

            </p>

        `;

        return;

    }


    employees.forEach(employee => {

        const card =
            document.createElement("div");


        card.classList.add(
            "employees__card",
            "section"
        );


        card.innerHTML = `

            <h2 class="employees__name">

                ${employee.name}

            </h2>


            <p class="employees__email">

                ${employee.email}

            </p>


            <p class="employees__role">

                Cargo:
                ${employee.role}

            </p>


            <p class="employees__status">

                Estado:
                ${employee.status}

            </p>


            <div class="employees__actions">

                <button
                    class="btn btn--verde"

                    onclick="updateEmployee('${employee.id}')">

                    Editar

                </button>


                <button
                    class="btn btn--rojo"

                    onclick="deleteEmployee('${employee.id}')">

                    Eliminar

                </button>

            </div>

        `;


        container.appendChild(
            card
        );

    });

}


window.updateEmployee =
    updateEmployee;


window.deleteEmployee =
    deleteEmployee;