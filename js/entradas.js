// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizarTexto(texto){
    return String(texto || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, " ");
}


// ==========================================
// DATOS
// ==========================================

let materiales =
    JSON.parse(localStorage.getItem("materiales")) || [];

let entradas =
    JSON.parse(localStorage.getItem("entradas")) || [];


// ==========================================
// USUARIO ACTIVO
// ==========================================

let usuarioActivo =
    JSON.parse(localStorage.getItem("usuarioActivo"));


// ==========================================
// VARIABLES DEL BUSCADOR
// ==========================================

let materialesDisponibles = [];


// ==========================================
// OBTENER CATEGORÍAS
// ==========================================

function cargarCategorias(){

    let select =
        document.getElementById("categoria");

    select.innerHTML = `
        <option value="">
            Seleccione categoría
        </option>
    `;


    // ======================================
    // COMPROBAR SESIÓN
    // ======================================

    if(!usuarioActivo){

        window.location.href = "index.html";

        return;
    }


    // ======================================
    // OBTENER CATEGORÍAS ÚNICAS
    // ======================================

    let categorias =
        [...new Set(
            materiales
                .map(m => normalizarTexto(m.categoria))
                .filter(c => c !== "")
        )];


    // ======================================
    // SI ES ADMINISTRADOR
    // ======================================

    if(usuarioActivo.rol === "Administrador"){

        select.innerHTML += `
            <option value="TODAS">
                Todas las categorías
            </option>
        `;


        categorias.forEach(categoria => {

            select.innerHTML += `
                <option value="${categoria}">
                    ${categoria}
                </option>
            `;

        });

    }


    // ======================================
    // SI ES ENCARGADO
    // ======================================

    else if(usuarioActivo.rol === "Encargado"){

        let categoriasPermitidas =
            usuarioActivo.categorias || [];


        categoriasPermitidas =
            categoriasPermitidas.map(c =>
                normalizarTexto(c)
            );


        categorias
            .filter(categoria =>
                categoriasPermitidas.includes(categoria)
            )
            .forEach(categoria => {

                select.innerHTML += `
                    <option value="${categoria}">
                        ${categoria}
                    </option>
                `;

            });

    }


    // ======================================
    // REINICIAR BUSCADOR
    // ======================================

    limpiarBuscadorMaterial();
}


// ==========================================
// PREPARAR MATERIALES SEGÚN CATEGORÍA
// ==========================================

function cargarMateriales(){

    let selectCategoria =
        document.getElementById("categoria");

    let buscador =
        document.getElementById("materialBusqueda");

    let lista =
        document.getElementById("listaMateriales");

    let materialOculto =
        document.getElementById("material");


    // ======================================
    // LIMPIAR SELECCIÓN ANTERIOR
    // ======================================

    materialOculto.value = "";

    buscador.value = "";

    lista.innerHTML = "";

    materialesDisponibles = [];


    let categoria =
        normalizarTexto(selectCategoria.value);


    // ======================================
    // SI NO HAY CATEGORÍA
    // ======================================

    if(categoria === ""){

        buscador.disabled = true;

        buscador.placeholder =
            "Seleccione primero una categoría";

        return;
    }


    // ======================================
    // FILTRAR MATERIALES
    // ======================================

    if(
        usuarioActivo.rol === "Administrador" &&
        categoria === "TODAS"
    ){

        materialesDisponibles = materiales;

    }

    else{

        materialesDisponibles =
            materiales.filter(material =>
                normalizarTexto(material.categoria) === categoria
            );

    }


    // ======================================
    // PERMISOS DEL ENCARGADO
    // ======================================

    if(usuarioActivo.rol === "Encargado"){

        let categoriasPermitidas =
            usuarioActivo.categorias || [];


        categoriasPermitidas =
            categoriasPermitidas.map(c =>
                normalizarTexto(c)
            );


        materialesDisponibles =
            materialesDisponibles.filter(material =>
                categoriasPermitidas.includes(
                    normalizarTexto(material.categoria)
                )
            );

    }


    // ======================================
    // ACTIVAR BUSCADOR
    // ======================================

    buscador.disabled = false;

    buscador.placeholder =
        "Buscar material...";

}


// ==========================================
// MOSTRAR SUGERENCIAS
// ==========================================

function mostrarSugerencias(texto){

    let lista =
        document.getElementById("listaMateriales");


    if(!lista) return;


    let textoBusqueda =
        normalizarTexto(texto);


    // ======================================
    // SI NO HAY TEXTO
    // NO MOSTRAR NADA
    // ======================================

    if(textoBusqueda === ""){

        lista.innerHTML = "";

        return;
    }


    // ======================================
    // FILTRAR POR INICIO DEL NOMBRE
    // ======================================

    let resultados =
        materialesDisponibles.filter(material => {

            let nombre =
                normalizarTexto(material.nombre);


            return nombre.startsWith(textoBusqueda);

        });


    lista.innerHTML = "";


    // ======================================
    // SI NO HAY RESULTADOS
    // ======================================

    if(resultados.length === 0){

        lista.innerHTML = `
            <div class="sin-resultados">
                No se encontraron materiales
            </div>
        `;

        return;
    }


    // ======================================
    // MOSTRAR RESULTADOS
    // ======================================

    resultados.forEach(material => {

        let indice =
            materiales.indexOf(material);


        let nombre =
            normalizarTexto(material.nombre);


        let unidad =
            normalizarTexto(material.unidad);


        let stock =
            Number(material.stock) || 0;


        let opcion =
            document.createElement("div");


        opcion.className =
            "opcion-material";


        opcion.innerHTML = `
            <strong>${nombre}</strong>
            <span>
                ${unidad} — Stock: ${stock}
            </span>
        `;


        opcion.onclick = function(){

            seleccionarMaterial(indice);

        };


        lista.appendChild(opcion);

    });

}


// ==========================================
// SELECCIONAR MATERIAL
// ==========================================

function seleccionarMaterial(indice){

    let material =
        materiales[indice];


    if(!material) return;


    let buscador =
        document.getElementById("materialBusqueda");


    let materialOculto =
        document.getElementById("material");


    let lista =
        document.getElementById("listaMateriales");


    let nombre =
        normalizarTexto(material.nombre);


    let unidad =
        normalizarTexto(material.unidad);


    // ======================================
    // GUARDAR ÍNDICE REAL
    // ======================================

    materialOculto.value =
        indice;


    // ======================================
    // MOSTRAR MATERIAL SELECCIONADO
    // ======================================

    buscador.value =
        `${nombre} (${unidad})`;


    // ======================================
    // OCULTAR SUGERENCIAS
    // ======================================

    lista.innerHTML = "";

}


// ==========================================
// LIMPIAR BUSCADOR
// ==========================================

function limpiarBuscadorMaterial(){

    let buscador =
        document.getElementById("materialBusqueda");


    let materialOculto =
        document.getElementById("material");


    let lista =
        document.getElementById("listaMateriales");


    if(buscador){

        buscador.value = "";

        buscador.disabled = true;

        buscador.placeholder =
            "Seleccione primero una categoría";

    }


    if(materialOculto){

        materialOculto.value = "";

    }


    if(lista){

        lista.innerHTML = "";

    }


    materialesDisponibles = [];

}


// ==========================================
// REGISTRAR ENTRADA
// ==========================================

function registrarEntrada(){

    // ======================================
    // COMPROBAR SESIÓN
    // ======================================

    if(!usuarioActivo){

        window.location.href = "index.html";

        return;
    }


    let categoria =
        document.getElementById("categoria").value;


    let indice =
        document.getElementById("material").value;


    let cantidad =
        Number(
            document.getElementById("cantidad").value
        );


    let responsable =
        document.getElementById("responsable").value;


    let observacion =
        document.getElementById("observacion").value;


    // ======================================
    // VALIDAR CATEGORÍA
    // ======================================

    if(categoria === ""){

        alert("Seleccione una categoría");

        return;
    }


    // ======================================
    // VALIDAR MATERIAL
    // ======================================

    if(indice === ""){

        alert("Seleccione un material");

        return;
    }


    let materialSeleccionado =
        materiales[Number(indice)];


    if(!materialSeleccionado){

        alert("❌ Material no encontrado");

        return;
    }


    // ======================================
    // COMPROBAR CATEGORÍA
    // ======================================

    if(
        categoria !== "TODAS" &&
        normalizarTexto(materialSeleccionado.categoria) !==
        normalizarTexto(categoria)
    ){

        alert(
            "🚫 El material no pertenece a la categoría seleccionada."
        );

        return;
    }


    // ======================================
    // COMPROBAR PERMISOS
    // ======================================

    if(usuarioActivo.rol === "Encargado"){

        let categoriasPermitidas =
            usuarioActivo.categorias || [];


        categoriasPermitidas =
            categoriasPermitidas.map(c =>
                normalizarTexto(c)
            );


        if(
            !categoriasPermitidas.includes(
                normalizarTexto(materialSeleccionado.categoria)
            )
        ){

            alert(
                "🚫 No tienes permiso para registrar entradas de esta categoría."
            );

            return;
        }

    }


    // ======================================
    // VALIDAR CANTIDAD
    // ======================================

    if(cantidad <= 0){

        alert("Ingrese una cantidad válida");

        return;
    }


    // ======================================
    // NORMALIZAR MATERIAL
    // ======================================

    materiales[Number(indice)].nombre =
        normalizarTexto(
            materiales[Number(indice)].nombre
        );


    materiales[Number(indice)].categoria =
        normalizarTexto(
            materiales[Number(indice)].categoria
        );


    materiales[Number(indice)].unidad =
        normalizarTexto(
            materiales[Number(indice)].unidad
        );


    // ======================================
    // AUMENTAR STOCK
    // ======================================

    materiales[Number(indice)].stock =
        Number(materiales[Number(indice)].stock) +
        cantidad;


    // ======================================
    // ACTUALIZAR ESTADO
    // ======================================

    if(materiales[Number(indice)].stock == 0){

        materiales[Number(indice)].estado =
            "🔴 AGOTADO";

    }

    else if(
        materiales[Number(indice)].stock <=
        Number(materiales[Number(indice)].minimo)
    ){

        materiales[Number(indice)].estado =
            "🟡 POR REPONER";

    }

    else{

        materiales[Number(indice)].estado =
            "🟢 DISPONIBLE";

    }


    // ======================================
    // GUARDAR MATERIALES
    // ======================================

    localStorage.setItem(
        "materiales",
        JSON.stringify(materiales)
    );


    // ======================================
    // GUARDAR ENTRADA
    // ======================================

    entradas.push({

        material:
            materiales[Number(indice)].nombre,

        categoria:
            materiales[Number(indice)].categoria,

        unidad:
            materiales[Number(indice)].unidad,

        cantidad,

        responsable,

        observacion,

        usuario:
            usuarioActivo.nombre,

        fecha:
            new Date().toLocaleString()

    });


    // ======================================
    // REGISTRAR MOVIMIENTO
    // ==========================================

    let movimientos =
        JSON.parse(
            localStorage.getItem("movimientos")
        ) || [];


    movimientos.push({

        fecha:
            new Date().toLocaleString(),

        tipo:
            "📥 ENTRADA",

        material:
            materiales[Number(indice)].nombre,

        categoria:
            materiales[Number(indice)].categoria,

        unidad:
            materiales[Number(indice)].unidad,

        cantidad,

        usuario:
            usuarioActivo.nombre

    });


    localStorage.setItem(
        "movimientos",
        JSON.stringify(movimientos)
    );


    // ======================================
    // GUARDAR ENTRADAS
    // ======================================

    localStorage.setItem(
        "entradas",
        JSON.stringify(entradas)
    );


    // ======================================
    // ACTUALIZAR HISTORIAL
    // ======================================

    mostrarEntradas();


    // ======================================
    // LIMPIAR FORMULARIO
    // ======================================

    document.getElementById("categoria").value = "";

    limpiarBuscadorMaterial();

    document.getElementById("cantidad").value = "";

    document.getElementById("responsable").value = "";

    document.getElementById("observacion").value = "";


    alert("Entrada registrada correctamente");

}


// ==========================================
// MOSTRAR HISTORIAL
// ==========================================

function mostrarEntradas(){

    let tabla =
        document.getElementById("tablaEntradas");


    tabla.innerHTML = "";


    entradas.forEach(e => {

        tabla.innerHTML += `

            <tr>

                <td>${normalizarTexto(e.material)}</td>

                <td>${e.cantidad}</td>

                <td>${e.responsable}</td>

                <td>${e.observacion}</td>

                <td>${e.usuario}</td>

                <td>${e.fecha}</td>

            </tr>

        `;

    });

}


// ==========================================
// EVENTOS DEL BUSCADOR
// ==========================================

document.addEventListener("DOMContentLoaded", function(){

    let buscador =
        document.getElementById("materialBusqueda");


    let materialOculto =
        document.getElementById("material");


    let lista =
        document.getElementById("listaMateriales");


    if(!buscador) return;


    // ======================================
    // CUANDO SE ESCRIBE
    // ======================================

    buscador.addEventListener("input", function(){

        // Al modificar el texto se elimina
        // cualquier selección anterior.

        materialOculto.value = "";


        let texto =
            normalizarTexto(this.value);


        // ==================================
        // CAMPO VACÍO
        // NO MOSTRAR LISTA
        // ==================================

        if(texto === ""){

            lista.innerHTML = "";

            return;
        }


        // ==================================
        // MOSTRAR COINCIDENCIAS
        // ==================================

        mostrarSugerencias(texto);

    });

});


// ==========================================
// AL CARGAR LA PÁGINA
// ==========================================

window.onload = function(){

    cargarCategorias();

    mostrarEntradas();

};
