import {
    getEmployees,
    saveEmployees
}
from "../services/employeeService.js";


export function deleteEmployee(id) {

    const confirmDelete =
        confirm(
            "¿Eliminar empleado?"
        );


    if (!confirmDelete) return;


    let employees =
        getEmployees();


    employees =
        employees.filter(employee =>

            employee.id !== id
        );


    saveEmployees(
        employees
    );


    location.reload();

}