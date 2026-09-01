function inicializarAdministrador(){

    let usuarios =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    if(usuarios.length === 0){

        usuarios = [
            {
                nombre: "Administrador",
                usuario: "admin",
                clave: "1234",
                rol: "Administrador",
                categorias: []
            }
        ];

        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );
    }
}


function login(){

    inicializarAdministrador();

    let usuario =
        document.getElementById("usuario").value;

    let clave =
        document.getElementById("clave").value;

    let usuarios =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    let encontrado = usuarios.find(u =>
        u.usuario === usuario &&
        u.clave === clave
    );

    if(encontrado){

        localStorage.setItem(
            "usuarioActivo",
            JSON.stringify(encontrado)
        );

        window.location.href = "dashboard.html";

    }

    else{

        document.getElementById("mensaje").innerHTML =
            "❌ Usuario o contraseña incorrectos";

    }
}
