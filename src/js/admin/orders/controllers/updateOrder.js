import {
    getOrders,
    saveOrders
}
from "../services/orderService.js";


export function updateOrder(id) {

    const orders =
        getOrders();


    const order =
        orders.find(order =>

            order.id === id
        );


    if (!order) return;


    const newStatus =
        prompt(

            `Nuevo estado:
            
            - Pendiente
            - En proceso
            - Entregado
            - Cancelado`,

            order.status

        );


    if (!newStatus) return;


    order.status =
        newStatus;


    saveOrders(
        orders
    );


    location.reload();

}