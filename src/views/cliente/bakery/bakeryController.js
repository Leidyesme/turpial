document.addEventListener("DOMContentLoaded", () => {

    setupAddToCart();

});


// AGREGAR AL CARRITO
function setupAddToCart() {

    const buttons =
        document.querySelectorAll(".add-to-cart");


    buttons.forEach((button) => {

        button.addEventListener("click", (e) => {

            e.preventDefault();


            const name =
                button.dataset.name;

            const price =
                parseInt(button.dataset.price);

            const status =
                button.dataset.status;


            // VALIDAR DISPONIBILIDAD
            if (status === "Agotado") {

                alert("Producto agotado");

                return;
            }


            // OBTENER CARRITO
            const cart =
                JSON.parse(localStorage.getItem("cart")) || [];


            // VERIFICAR SI YA EXISTE
            const existingProduct =
                cart.find(product => product.name === name);


            if (existingProduct) {

                existingProduct.quantity += 1;

            } else {

                cart.push({
                    name,
                    price,
                    quantity: 1
                });

            }


            // GUARDAR
            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            alert("Producto agregado al carrito");

        });

    });

}