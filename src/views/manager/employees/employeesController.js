import {
    setupAddEmployee
}
from "../../js/admin/employees/controllers/createEmployee.js";


import {
    loadEmployees
}
from "../../js/admin/employees/controllers/readEmployees.js";


document.addEventListener(
    "DOMContentLoaded",

    () => {

        loadEmployees();

        setupAddEmployee(loadEmployees);

    }
);