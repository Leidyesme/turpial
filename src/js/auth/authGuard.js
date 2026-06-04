const usuarioActivo =

    JSON.parse(

        localStorage.getItem(
            "usuarioActivo"
        )

    );


if (!usuarioActivo) {

    window.location.href =

        "../../../views/auth/login/login.html";

}