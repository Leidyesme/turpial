const codeForm =
document.querySelector('#codeForm');

codeForm.addEventListener('submit', function(e){

    e.preventDefault();

    const codigo =
    document.querySelector('#code').value;

    if(codigo === '1234'){

        alert('Código correcto');

        window.location.href =
        '../../cliente/categories/categories.html';

    }

    else{

        alert('Código incorrecto');
    }

});