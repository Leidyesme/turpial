import {
    setupAddEmployee
}
from "../../../js/admin/employees/controllers/createEmployee.js";


import {
    loadEmployees,
    setupEmployeeSearch
}
from "../../../js/admin/employees/controllers/readEmployee.js";

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadEmployees();
        setupEmployeeSearch();
        setupAddEmployee(loadEmployees);
    }
);