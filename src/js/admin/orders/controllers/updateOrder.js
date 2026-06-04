import {
    getOrders,
    saveOrders
}
from "../services/orderService.js";


export function updateOrder(index, newStatus) {

    const orders =
        getOrders();


    if (!orders[index]) return;


    orders[index].status =
        newStatus;


    saveOrders(
        orders
    );


    location.reload();

}