export function addToCart(product) {

    // OBTENER CARRITO
    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    // OBTENER STOCK Y PRODUCTOS DE DB LOCAL DE MANERA ROBUSTA
    const productsDb = JSON.parse(localStorage.getItem("products")) || [];
    
    // RESOLVER ID REAL DEL PRODUCTO (PROD-XXX)
    let resolvedId = product.id || product.idProducto || "";
    
    // Buscar coincidencia en productosDb para resolver ID o datos faltantes
    const matchedDb = productsDb.find(item => 
        (resolvedId && (item.id === resolvedId || item.idProducto === resolvedId)) ||
        (item.name && product.name && (item.name.toLowerCase().includes(product.name.toLowerCase()) || product.name.toLowerCase().includes(item.name.toLowerCase())))
    );

    if (matchedDb && !resolvedId) {
        resolvedId = matchedDb.id || matchedDb.idProducto || "";
    }

    // BUSCAR PRODUCTO EXISTENTE EN EL CARRITO
    const existingProduct = cart.find(item =>
        (resolvedId && (item.id === resolvedId || item.idProducto === resolvedId)) ||
        (item.name && product.name && item.name === product.name)
    );

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

    // SI YA EXISTE EN CARRITO
    if (existingProduct) {
        existingProduct.quantity += 1;
        if (resolvedId) {
            existingProduct.id = resolvedId;
            existingProduct.idProducto = resolvedId;
        }
    } else {
        // AGREGAR NUEVO PRODUCTO CON PROPIEDADES ESTÁNDAR
        cart.push({
            ...product,
            id: resolvedId,
            idProducto: resolvedId,
            quantity: 1
        });
    }

    // GUARDAR CARRITO ACTUALIZADO
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Producto agregado al carrito");
}