// ==========================================
// VERIFICAR PERMISOS
// ==========================================

const usuarioActivo =
    JSON.parse(localStorage.getItem("usuarioActivo"));


// Si no hay sesión
if (!usuarioActivo) {

    alert("⚠️ Debes iniciar sesión.");

    window.location.href = "index.html";

}


// Si es Encargado, no puede entrar a Usuarios
if (
    usuarioActivo &&
    usuarioActivo.rol === "Encargado"
) {

    alert("🚫 No tienes permiso para acceder a Usuarios.");

    window.location.href = "index.html";

}

let usuarios =
JSON.parse(localStorage.getItem("usuarios")) || [];


// ==========================================
// MOSTRAR CATEGORÍAS PARA ENCARGADOS
// ==========================================

function mostrarCategorias(){

    let rol =
    document.getElementById("rol").value;

    let contenedor =
    document.getElementById("contenedorCategorias");

    let lista =
    document.getElementById("listaCategorias");


    // Limpiar lista
    lista.innerHTML = "";


    // Si es administrador, ocultar categorías
    if(rol === "Administrador"){

        contenedor.style.display = "none";

        return;

    }


    // Mostrar contenedor
    contenedor.style.display = "block";


    // Obtener materiales
    let materiales =
    JSON.parse(localStorage.getItem("materiales")) || [];


    // Obtener categorías únicas
    let categorias =
    [...new Set(
        materiales
        .map(m => m.categoria)
        .filter(c => c && c.trim() !== "")
    )];


    // Si no hay categorías
    if(categorias.length === 0){

        lista.innerHTML =
        "<p>⚠️ No hay categorías registradas.</p>";

        return;

    }


    // Crear las opciones
    categorias.forEach(categoria => {

        lista.innerHTML += `

            <label style="display:block; margin:6px 0;">

                <input
                    type="checkbox"
                    name="categoria"
                    value="${categoria}"
                >

                ${categoria}

            </label>

        `;

    });

}


// ==========================================
// GUARDAR USUARIO
// ==========================================

function guardarUsuario(){

    let nombre =
    document.getElementById("nombre").value;

    let usuario =
    document.getElementById("usuario").value;

    let clave =
    document.getElementById("clave").value;

    let rol =
    document.getElementById("rol").value;


    // ======================================
    // OBTENER CATEGORÍAS SELECCIONADAS
    // ======================================

    let categorias = [];


    if(rol === "Encargado"){

        categorias =
        [...document.querySelectorAll(
            'input[name="categoria"]:checked'
        )]
        .map(c => c.value);


        // Verificar que haya al menos una
        if(categorias.length === 0){

            alert(
                "⚠️ Seleccione al menos una categoría para el encargado."
            );

            return;

        }

    }


    // ======================================
    // CREAR USUARIO
    // ======================================

    usuarios.push({

        nombre,
        usuario,
        clave,
        rol,
        categorias

    });


    // ======================================
    // GUARDAR
    // ======================================

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );


    mostrarUsuarios();


    alert("Usuario creado correctamente");


    // Limpiar formulario

    document.getElementById("nombre").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("clave").value = "";

    document.getElementById("rol").value = "Administrador";


    // Ocultar categorías

    document.getElementById(
        "contenedorCategorias"
    ).style.display = "none";

    document.getElementById(
        "listaCategorias"
    ).innerHTML = "";

}


// ==========================================
// MOSTRAR USUARIOS
// ==========================================

function mostrarUsuarios(){

    let tabla =
    document.getElementById("tablaUsuarios");


    tabla.innerHTML = "";


    usuarios.forEach(u => {

        tabla.innerHTML += `

            <tr>

                <td>${u.nombre}</td>

                <td>${u.usuario}</td>

                <td>${u.rol}</td>

            </tr>

        `;

    });

}


// ==========================================
// CARGAR AL ABRIR
// ==========================================

window.onload = function(){

    mostrarUsuarios();

};
