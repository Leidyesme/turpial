const formulario =
document.querySelector('#registroForm');

formulario.addEventListener('submit', function(e){

    e.preventDefault();

    const nuevoUsuario = {

        nombre:
        document.querySelector('#nombre').value,

        correo:
        document.querySelector('#correo').value,

        telefono:
        document.querySelector('#telefono').value,

        contraseña:
        document.querySelector('#contraseña').value,

        rol : 'ROL-003',

        estado : 'activo',

        fecha_registro :
        new Date().toISOString().split('T')[0]
    };

    let usuarios =
    JSON.parse(localStorage.getItem('usuarios'))
    || [];

    usuarios.push(nuevoUsuario);

    localStorage.setItem(
        'usuarios',
        JSON.stringify(usuarios)
    );

    alert('Usuario registrado');

    window.location.href = '../login/login.html';
});