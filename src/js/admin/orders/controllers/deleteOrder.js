import {
    getOrders,
    saveOrders
}
from "../services/orderService.js";


export function deleteOrder(index) {

    const confirmDelete =
        confirm(
            "¿Eliminar pedido?"
        );


    if (!confirmDelete) return;


    const orders =
        getOrders();


    orders.splice(index, 1);


    saveOrders(
        orders
    );


    location.reload();

}