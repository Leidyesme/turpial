document.addEventListener("DOMContentLoaded", () => {

    setupAddToCart();

});


function setupAddToCart() {

    const buttons =
        document.querySelectorAll(".add-to-cart");


    buttons.forEach((button) => {

        button.addEventListener("click", (e) => {

            e.preventDefault();


            const product = {

                name:
                    button.dataset.name,

                price:
                    parseInt(button.dataset.price),

                image:
                    button.dataset.image,

                status:
                    button.dataset.status,

                quantity: 1

            };


            addProductToCart(product);

        });

    });

}


function addProductToCart(product) {

    // VALIDAR DISPONIBILIDAD
    if (product.status === "Agotado") {

        alert("Producto agotado");

        return;
    }


    // OBTENER CARRITO
    let cart =
        JSON.parse(localStorage.getItem("cart"))
        || [];


    // BUSCAR PRODUCTO EXISTENTE
    const existingProduct =
        cart.find(
            item => item.name === product.name
        );


    // SI YA EXISTE
    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        // AGREGAR NUEVO
        cart.push(product);

    }


    // GUARDAR
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert("Producto agregado al carrito");

}