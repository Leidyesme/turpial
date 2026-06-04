import { getProducts } from "../../../js/admin/products/services/productService.js";
import { getOrders } from "../../../js/admin/orders/services/orderService.js";

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Mostrar cantidad de productos
    const productCantElements = document.querySelectorAll(".homePage__cant");
    const products = getProducts();
    if (productCantElements[1]) {
        productCantElements[1].textContent = `${products.length} productos`;
    }

    // 2. Mostrar cantidad de empleados desde el backend
    if (productCantElements[0]) {
        try {
            const response = await fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=listEmployees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.status === "success") {
                    const employees = data.employees || [];
                    productCantElements[0].textContent = `${employees.length} empleados`;
                } else {
                    productCantElements[0].textContent = "0 empleados";
                }
            } else {
                productCantElements[0].textContent = "0 empleados";
            }
        } catch (error) {
            console.error("Error cargando cantidad de empleados:", error);
            productCantElements[0].textContent = "Error al conectar";
        }
    }

    // 3. Mostrar pedidos recientes en la tabla
    const tableBody = document.querySelector(".data-table__body");
    if (tableBody) {
        const orders = getOrders();
        tableBody.innerHTML = "";
        
        if (orders.length === 0) {
            tableBody.innerHTML = `
                <tr class="data-table__row">
                    <td colspan="5" class="data-table__fact" style="text-align: center;">No hay pedidos registrados</td>
                </tr>
            `;
        } else {
            // Mostrar los últimos 3 pedidos (o todos si hay menos de 3)
            const recentOrders = orders.slice(-3).reverse();
            recentOrders.forEach((order) => {
                const actualIndex = orders.indexOf(order);
                const tr = document.createElement("tr");
                tr.classList.add("data-table__row");
                tr.innerHTML = `
                    <td class="data-table__fact">#${actualIndex + 1}</td>
                    <td class="data-table__fact">${order.clientName || order.customer || 'Cliente'}</td>
                    <td class="data-table__fact">${order.status}</td>
                    <td class="data-table__fact">${order.date ? order.date.split(',')[0] : 'Sin fecha'}</td>
                    <td class="data-table__fact">$${order.total}</td>
                `;
                tableBody.appendChild(tr);
            });
        }
    }

    // 4. Navegación a ver todos los pedidos
    const verTodosPedidosBtn = document.querySelector(".homePage__orders:last-of-type");
    if (verTodosPedidosBtn) {
        verTodosPedidosBtn.style.cursor = "pointer";
        verTodosPedidosBtn.addEventListener("click", () => {
            window.location.href = "../orders/orders.html";
        });
    }
});
