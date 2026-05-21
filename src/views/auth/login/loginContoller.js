const loginForm =
document.querySelector('#login__Form');

console.log(loginForm);

loginForm.addEventListener('submit', function(e){

    e.preventDefault();

    console.log('Formulario enviado');

    const correo =
    document.querySelector('#email').value;

    const contraseña =
    document.querySelector('#contraseña').value;

    const usuarios =
    JSON.parse(localStorage.getItem('usuarios'))
    || [];

    console.log(usuarios);

    const usuarioEncontrado =
    usuarios.find(usuario =>

        usuario.correo === correo &&
        usuario.contraseña === contraseña
    );

    console.log(usuarioEncontrado);

    if(!usuarioEncontrado){

        alert('Correo o contraseña incorrectos');

        return;
    }

    localStorage.setItem(
        'usuarioActivo',
        JSON.stringify(usuarioEncontrado)
    );

    window.location.href =
    '../../cliente/categories/categories.html';

});