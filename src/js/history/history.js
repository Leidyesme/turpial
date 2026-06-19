function guardarHistorial(usuario, rol, accion) {
    // 1. Guardar localmente para mantener compatibilidad
    const historial = JSON.parse(localStorage.getItem("historial")) || [];
    historial.push({
        usuario,
        rol,
        accion,
        fecha: new Date().toLocaleString()
    });
    localStorage.setItem("historial", JSON.stringify(historial));

    // 2. Intentar registrar en el Backend (AuditoriaServlet)
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    const idUsuario = usuarioActivo ? usuarioActivo.idUsuario : "USR-001"; // Fallback por defecto

    let tipoAccion = "OTROS";
    const upperAccion = accion.toUpperCase();
    if (upperAccion.includes("INICIÓ SESIÓN") || upperAccion.includes("LOGIN")) tipoAccion = "LOGIN";
    else if (upperAccion.includes("CERRÓ SESIÓN") || upperAccion.includes("LOGOUT")) tipoAccion = "LOGOUT";
    else if (upperAccion.includes("PEDIDO") || upperAccion.includes("COMPRA")) tipoAccion = "CREAR_PEDIDO";
    else if (upperAccion.includes("DEVOLUCIÓN") || upperAccion.includes("DEVOLUCION")) tipoAccion = "DEVOLUCION";
    else if (upperAccion.includes("PERFIL")) tipoAccion = "EDITAR_PERFIL";

    fetch("http://localhost:8080/turpialJava/auditoria?accion=registrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idUsuario: idUsuario,
            accion: accion,
            tipoAccion: tipoAccion
        })
    })
    .then(res => res.json())
    .then(data => console.log("Auditoría guardada en DB:", data))
    .catch(err => console.error("Error al registrar auditoria en el servidor:", err));
}
