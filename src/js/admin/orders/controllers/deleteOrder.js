import {
    getOrders,
    saveOrders
}
from "../services/orderService.js";


export function deleteOrder(id) {

    const confirmDelete =
        confirm(
            "¿Eliminar pedido?"
        );


    if (!confirmDelete) return;


    let orders =
        getOrders();


    orders =
        orders.filter(order =>

            order.id !== id
        );


    saveOrders(
        orders
    );


    location.reload();

}