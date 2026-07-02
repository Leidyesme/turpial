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

    // 2.5 Mostrar cantidad de devoluciones pendientes desde el backend
    const devolucionesCantElement = document.getElementById("devolucionesCant");
    if (devolucionesCantElement) {
        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
        if (usuarioActivo) {
            try {
                const response = await fetch(`http://localhost:8080/turpialJava/devolucion?accion=listarTodas&idUsuario=${usuarioActivo.idUsuario}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === "success" && data.returns) {
                        const pendingReturns = data.returns.filter(d => d.estadoDevolucion === "Pendiente");
                        devolucionesCantElement.textContent = `${pendingReturns.length} devoluciones pendientes`;
                    } else {
                        devolucionesCantElement.textContent = "0 devoluciones pendientes";
                    }
                } else {
                    devolucionesCantElement.textContent = "0 devoluciones pendientes";
                }
            } catch (error) {
                console.error("Error cargando cantidad de devoluciones:", error);
                devolucionesCantElement.textContent = "Error al conectar";
            }
        }
    }

    // 3. Mostrar pedidos recientes en la tabla desde la base de datos
    const tableBody = document.querySelector(".data-table__body");
    if (tableBody) {
        tableBody.innerHTML = `
            <tr class="data-table__row">
                <td colspan="5" class="data-table__fact" style="text-align: center;">Cargando pedidos...</td>
            </tr>
        `;
        
        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
        if (usuarioActivo) {
            try {
                const response = await fetch(`http://localhost:8080/turpialJava/HistorialServlet?accion=listar&idUsuario=${usuarioActivo.idUsuario}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === "success" && data.orders) {
                        const dbOrders = data.orders || [];
                        tableBody.innerHTML = "";
                        
                        if (dbOrders.length === 0) {
                            tableBody.innerHTML = `
                                <tr class="data-table__row">
                                    <td colspan="5" class="data-table__fact" style="text-align: center;">No hay pedidos registrados</td>
                                </tr>
                            `;
                        } else {
                            // Mostrar los últimos 3 pedidos (o todos si hay menos de 3)
                            const recentOrders = dbOrders.slice(0, 3); // Ya vienen ordenados DESC por fecha_pedido en el servlet
                            recentOrders.forEach((order) => {
                                const tr = document.createElement("tr");
                                tr.classList.add("data-table__row");
                                tr.innerHTML = `
                                    <td class="data-table__fact">#${order.idPedido}</td>
                                    <td class="data-table__fact">${order.customerName || 'Cliente'}</td>
                                    <td class="data-table__fact">${order.status}</td>
                                    <td class="data-table__fact">${order.date ? order.date.split(' ')[0] : 'Sin fecha'}</td>
                                    <td class="data-table__fact">$${Number(order.total).toLocaleString()}</td>
                                `;
                                tableBody.appendChild(tr);
                            });
                        }
                    } else {
                        tableBody.innerHTML = `
                            <tr class="data-table__row">
                                <td colspan="5" class="data-table__fact" style="text-align: center;">No se pudieron cargar los pedidos</td>
                            </tr>
                        `;
                    }
                } else {
                    tableBody.innerHTML = `
                        <tr class="data-table__row">
                            <td colspan="5" class="data-table__fact" style="text-align: center;">Error de servidor</td>
                        </tr>
                    `;
                }
            } catch (error) {
                console.error("Error cargando pedidos recientes:", error);
                tableBody.innerHTML = `
                    <tr class="data-table__row">
                        <td colspan="5" class="data-table__fact" style="text-align: center; color: red;">Error al conectar</td>
                    </tr>
                `;
            }
        } else {
            tableBody.innerHTML = `
                <tr class="data-table__row">
                    <td colspan="5" class="data-table__fact" style="text-align: center;">Inicie sesión para ver los pedidos</td>
                </tr>
            `;
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
