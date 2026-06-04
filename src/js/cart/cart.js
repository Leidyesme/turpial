export function addToCart(product) {

    // OBTENER CARRITO
    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    // BUSCAR PRODUCTO EXISTENTE
    const existingProduct =
        cart.find(item =>

            item.name === product.name
        );

    // OBTENER STOCK DE DB LOCAL
    const productsDb = JSON.parse(localStorage.getItem("products")) || [];
    const matchedDb = productsDb.find(item => item.name === product.name);

    if (matchedDb) {
        const maxStock = parseInt(matchedDb.stock) || 0;
        if (maxStock <= 0 || matchedDb.status === "Agotado") {
            alert("Este producto está agotado y no se puede agregar al carrito.");
            return;
        }
        const currentQty = existingProduct ? existingProduct.quantity : 0;
        if (currentQty + 1 > maxStock) {
            alert(`No puedes agregar más de este producto. Stock disponible: ${maxStock}`);
            return;
        }
    } else if (product.status === "Agotado") {
        alert("Este producto está agotado y no se puede agregar al carrito.");
        return;
    }

    // SI YA EXISTE
    if (existingProduct) {

        existingProduct.quantity += 1;

    }

    else {

        // AGREGAR NUEVO
        cart.push({

            ...product,

            quantity: 1

        });

    }

    // GUARDAR
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert(
        "Producto agregado al carrito"
    );

}