export function getProducts() {

    return JSON.parse(
        localStorage.getItem("products")
    ) || [];

}


export function saveProducts(products) {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}