import {
    updateEmployee
}
from "./updateEmployee.js";


import {
    deleteEmployee
}
from "./deleteEmployee.js";


export function setupEmployeeSearch() {
    const searchInput = document.querySelector("#searchEmployee");
    if (!searchInput) return;
    searchInput.oninput = () => {
        loadEmployees();
    };
}

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
            let employeesToRender = data.employees || [];
            const searchInput = document.querySelector("#searchEmployee");
            const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

            if (query) {
                employeesToRender = employeesToRender.filter(emp => {
                    const name = (emp.name || "").toLowerCase();
                    const email = (emp.email || "").toLowerCase();
                    const role = (emp.role === "ROL-001" ? "administrador" : emp.role === "ROL-002" ? "empleado" : String(emp.role)).toLowerCase();
                    const status = (emp.status || "").toLowerCase();
                    return name.includes(query) || email.includes(query) || role.includes(query) || status.includes(query);
                });
            }

            renderEmployees(employeesToRender);
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
                ${employee.role === 'ROL-001' ? 'Administrador' : (employee.role === 'ROL-002' ? 'Empleado' : (employee.role === 'ROL-003' ? 'Cliente' : employee.role))}

            </p>


            <p class="employees__status">

                Estado:
                <span style="font-weight: bold; color: ${employee.status === 'Activo' ? '#2e7d32' : '#d32f2f'};">${employee.status || 'Inactivo'}</span>

            </p>


            <div class="employees__actions">

                <button
                    class="btn btn--verde"

                    onclick="updateEmployee('${employee.id}')">

                    Editar

                </button>

                <button
                    class="btn ${employee.status === 'Activo' ? 'btn--rojo' : 'btn--verde'}"

                    onclick="toggleEmployeeStatus('${employee.id}', '${employee.status === 'Activo' ? 'Inactivo' : 'Activo'}')">

                    ${employee.status === 'Activo' ? 'Desactivar' : 'Activar'}

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

export async function toggleEmployeeStatus(id, newStatus) {
    try {
        const readResp = await fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=readUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idUsuario: id })
        });
        if (!readResp.ok) {
            throw new Error("Error al consultar el empleado");
        }
        const empData = await readResp.json();
        if (empData.status !== "success") {
            alert("No se encontró el empleado");
            return;
        }

        const payload = {
            id: id,
            name: empData.name,
            email: empData.email,
            phone: empData.phone || "",
            role: empData.idRol || "ROL-002",
            status: newStatus
        };

        const response = await fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=updateEmployee", {
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
            alert(`El empleado ha sido cambiado a estado '${newStatus}'.`);
            loadEmployees();
        } else {
            alert("Error al cambiar el estado: " + data.message);
        }
    } catch (error) {
        console.error("Error al cambiar el estado del empleado:", error);
        alert("No se pudo conectar con el servidor para cambiar el estado.");
    }
}

window.updateEmployee = updateEmployee;
window.deleteEmployee = deleteEmployee;
window.toggleEmployeeStatus = toggleEmployeeStatus;