function guardarHistorial(
    usuario,
    rol,
    accion
) {

    const historial =
        JSON.parse(
            localStorage.getItem("historial")
        ) || [];

    historial.push({

        usuario,

        rol,

        accion,

        fecha:
            new Date().toLocaleString()

    });

    localStorage.setItem(
        "historial",
        JSON.stringify(historial)
    );

}
