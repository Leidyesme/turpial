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

        (e) => {

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


            const employees =
                getEmployees();


            const newEmployee = {

                id:
                    generateEmployeeId(),

                name,

                email,

                role,

                status:
                    "Activo"

            };


            employees.push(
                newEmployee
            );


            saveEmployees(
                employees
            );


            form.reset();


            loadEmployees();

        }
    );

}