import {
    getEmployees
}
from "../services/employeeService.js";


import {
    updateEmployee
}
from "./updateEmployee.js";


import {
    deleteEmployee
}
from "./deleteEmployee.js";


export function loadEmployees() {

    const employees =
        getEmployees();


    renderEmployees(
        employees
    );

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

                    onclick="updateEmployee(${employee.id})">

                    Editar

                </button>


                <button
                    class="btn btn--rojo"

                    onclick="deleteEmployee(${employee.id})">

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