// apiHelper.js

// URL base del servidor Tomcat para evitar escribirla todo el tiempo
const BASE_URL = "http://localhost:8080/turpialJava/PruebaServlet";

/**
 * Función auxiliar centralizada para realizar peticiones HTTP de forma limpia.
 * @param {string} accion - El nombre de la acción (ej: 'registrar', 'login', 'listar')
 * @param {string} metodo - El método HTTP ('GET', 'POST', 'PUT', 'DELETE')
 * @param {Object|null} datos - El objeto con los datos a enviar (automáticamente se convierte a JSON)
 */
async function enviarPeticion(accion, metodo = "POST", datos = null) {
    // Construimos la URL agregando el parámetro de la acción
    const url = `${BASE_URL}?accion=${accion}`;
    
    // Configuración por defecto de la petición
    const opciones = {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Si pasamos datos y no es una petición GET, los adjuntamos en el cuerpo serializados
    if (datos && metodo !== "GET") {
        opciones.body = JSON.stringify(datos);
    }

    try {
        const respuesta = await fetch(url, opciones);
        
        // Si el servidor responde con un código de error (ej: 404, 500)
        if (!respuesta.ok) {
            throw new Error(`Error en el servidor: ${respuesta.status} ${respuesta.statusText}`);
        }
        
        // Retornamos directamente el JSON procesado
        return await respuesta.json();
    } catch (error) {
        console.error(`Error en la petición [${accion}]:`, error);
        // Retornamos un objeto con formato estándar de error para que el controlador lo maneje
        return { 
            status: "error", 
            message: "No se pudo establecer conexión con el servidor de El Turpial." 
        };
    }
}