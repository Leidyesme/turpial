document.querySelector('iniciarSesionForm').addEventListener('submit',function(e){
    e.preventDefault();

    constusuario = {
        correo : document.querySelector('correo').value,
        contraseña : document.querySelector('contraseña').value,
        estado : 'activo'
    }

})