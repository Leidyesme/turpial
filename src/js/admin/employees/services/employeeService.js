const EMPLOYEES_KEY =
    "employees";


export function getEmployees() {

    return JSON.parse(

        localStorage.getItem(
            EMPLOYEES_KEY
        )

    ) || [];

}


export function saveEmployees(employees) {

    localStorage.setItem(

        EMPLOYEES_KEY,

        JSON.stringify(employees)

    );

}