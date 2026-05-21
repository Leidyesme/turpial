const recoverForm =
document.querySelector('#recoverForm');

recoverForm.addEventListener('submit', function(e){

    e.preventDefault();

    const correo =
    document.querySelector('#email').value;

    const usuarios =
    JSON.parse(localStorage.getItem('usuarios'))
    || [];

    const usuarioExiste =
    usuarios.find(
        usuario => usuario.correo === correo
    );

    if(!usuarioExiste){

        alert('El correo no existe');

        return;
    }

    localStorage.setItem(
        'correoRecuperacion',
        correo
    );

    alert('Código enviado');

    window.location.href =
    '../codepassword/codepassword.html';
});