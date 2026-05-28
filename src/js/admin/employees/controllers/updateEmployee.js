import {
    getEmployees,
    saveEmployees
}
from "../services/employeeService.js";


export function updateEmployee(id) {

    const employees =
        getEmployees();


    const employee =
        employees.find(employee =>

            employee.id === id
        );


    if (!employee) return;


    const newName =
        prompt(
            "Nuevo nombre",
            employee.name
        );


    if (!newName) return;


    const newEmail =
        prompt(
            "Nuevo correo",
            employee.email
        );


    const newRole =
        prompt(
            "Nuevo cargo",
            employee.role
        );


    const newStatus =
        prompt(
            "Estado",
            employee.status
        );


    employee.name =
        newName;

    employee.email =
        newEmail;

    employee.role =
        newRole;

    employee.status =
        newStatus;


    saveEmployees(
        employees
    );


    location.reload();

}