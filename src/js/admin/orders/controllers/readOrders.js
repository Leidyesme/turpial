const ORDERS_KEY =
    "orders";


export function getOrders() {

    return JSON.parse(

        localStorage.getItem(
            ORDERS_KEY
        )

    ) || [];

}


export function saveOrders(orders) {

    localStorage.setItem(

        ORDERS_KEY,

        JSON.stringify(orders)

    );

}