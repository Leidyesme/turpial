document.addEventListener("DOMContentLoaded", () => {

    setupAddProduct();

    setupForm();

});


let products = [];


function setupAddProduct() {

    const addProductBtn =
        document.querySelector(
            "#addProductBtn"
        );


    addProductBtn.addEventListener("click", () => {

        addProduct();

    });

}


function addProduct() {

    const productName =
        prompt("Nombre del producto");

    const productPrice =
        parseFloat(
            prompt("Precio producto")
        );

    const quantity =
        parseInt(
            prompt("Cantidad")
        );


    // VALIDAR
    if (
        !productName ||
        isNaN(productPrice) ||
        isNaN(quantity)
    ) {

        alert("Datos inválidos");

        return;

    }


    const product = {

        name: productName,

        price: productPrice,

        quantity: quantity

    };


    products.push(product);


    renderProducts();

}


function renderProducts() {

    const container =
        document.querySelector(
            "#productsContainer"
        );


    const totalElement =
        document.querySelector(
            "#orderTotal"
        );


    container.innerHTML = "";


    let total = 0;


    products.forEach((product) => {

        total +=
            product.price *
            product.quantity;


        const productCard =
            document.createElement("div");


        productCard.classList.add(
            "newOrder__product"
        );


        productCard.innerHTML = `

            <p>

                ${product.name}

            </p>

            <p>

                Cantidad:
                ${product.quantity}

            </p>

            <p>

                Precio:
                $${product.price}

            </p>

        `;


        container.appendChild(
            productCard
        );

    });


    totalElement.textContent =
        `Total: $${total}`;

}


function setupForm() {

    const form =
        document.querySelector(
            ".newOrder__form"
        );


    form.addEventListener("submit", (e) => {

        e.preventDefault();


        registerOrder();

    });

}


function registerOrder() {

    const customerName =
        document.querySelector(
            "#customerName"
        ).value;


    const orderType =
        document.querySelector(
            "input[name='orderType']:checked"
        );


    const observation =
        document.querySelector(
            "#orderObservation"
        ).value;


    // VALIDAR
    if (
        customerName === "" ||
        !orderType ||
        products.length === 0
    ) {

        alert(
            "Complete all fields"
        );

        return;

    }


    // TOTAL
    const total =
        products.reduce(
            (acc, product) => {

                return (
                    acc +
                    (
                        product.price *
                        product.quantity
                    )
                );

            },
            0
        );


    // PEDIDO
    const newOrder = {
        
        id: Date.now(),

        customer: customerName,

        type: orderType.value,

        observation,

        products,

        total,

        status: "En proceso",

        date:
            new Date()
            .toLocaleDateString()

    };


    // OBTENER ORDERS
    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        )
        || [];


    // GUARDAR
    orders.push(newOrder);


    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    alert(
        "Pedido registrado correctamente"
    );


    // REDIRECCIONAR
    window.location.href =
        "../orders/orders.html";

}