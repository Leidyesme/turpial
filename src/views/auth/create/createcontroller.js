document.querySelector('registroForm').addEventListener('submit',function(e){
    e.preventDefault();

    const nuevoUsuario = {
        nombre : document.querySelector('nombre').value,
        correo : document.querySelector('correo').value,
        telefono: document.querySelector('telefono').value,
        contraseña : document.querySelector('contraseña').value,
        rol : 'ROL-003',
        estado : 'activo',
        fecha_registro : new Date().toISOString().split('T')[0]
    };
    
})