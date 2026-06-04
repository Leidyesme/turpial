const cartContainer =
    document.querySelector(
        "#cartContainer"
    );


const cartTotal =
    document.querySelector(
        "#cartTotal"
    );


const checkoutButton =
    document.querySelector(
        "#checkoutButton"
    );


let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


renderCart();


function renderCart() {

    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <p>
                El carrito está vacío
            </p>

        `;

        cartTotal.textContent =
            "Total: $0";

        return;

    }


    let total = 0;


    cart.forEach(product => {

        total +=
            product.price *
            product.quantity;


        const card =
            document.createElement("div");


        card.classList.add(
            "fastcar__product"
        );


        card.innerHTML = `

            <img
                src="${product.image}"

                class="fastcar__img">


            <h3>
                ${product.name}
            </h3>


            <p>
                $${product.price}
            </p>


            <p>
                Cantidad:
                ${product.quantity}
            </p>

        `;


        cartContainer.appendChild(
            card
        );

    });


    cartTotal.textContent =
        `Total: $${total}`;

}


checkoutButton.addEventListener(
    "click",

    () => {

        if (cart.length === 0) {

            alert(
                "El carrito está vacío"
            );

            return;

        }


        const orders =
            JSON.parse(
                localStorage.getItem(
                    "orders"
                )
            ) || [];


        const total =
            cart.reduce(

                (acc, item) =>

                    acc +
                    item.price *
                    item.quantity,

                0
            );


        const newOrder = {

            id: Date.now(),

            products: cart,

            total,

            status: "En proceso",

            date:
                new Date()
                .toLocaleDateString()

        };


        orders.push(
            newOrder
        );


        localStorage.setItem(

            "orders",

            JSON.stringify(orders)

        );


        localStorage.removeItem(
            "cart"
        );


        alert(
            "Pedido realizado"
        );


        location.reload();

    }
);