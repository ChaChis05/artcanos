// ===============================
// SALIDAS ART CANOS
// ===============================

let materiales = JSON.parse(localStorage.getItem("materiales")) || [];
let salidas = JSON.parse(localStorage.getItem("salidas")) || [];
let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

let materialesDisponibles = [];


// ===============================
// NORMALIZAR TEXTO
// ===============================

function normalizarTexto(texto) {

    return String(texto || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, " ");

}


// ===============================
// VERIFICAR SESIÓN
// ===============================

if (!usuarioActivo) {

    alert("⚠️ Debes iniciar sesión.");

    window.location.href = "index.html";

}


// ===============================
// CARGAR CATEGORÍAS
// ===============================

function cargarCategorias() {

    const selectCategoria =
        document.getElementById("categoria");

    if (!selectCategoria) return;

    selectCategoria.innerHTML = `
        <option value="">
            Seleccione categoría
        </option>
    `;


    // Obtener categorías existentes

    let categorias = [
        ...new Set(
            materiales
                .map(material =>
                    normalizarTexto(material.categoria)
                )
                .filter(categoria => categoria)
        )
    ];


    // ===============================
    // ADMINISTRADOR
    // ===============================

    if (usuarioActivo.rol === "Administrador") {

        selectCategoria.innerHTML += `
            <option value="TODAS">
                TODAS LAS CATEGORÍAS
            </option>
        `;

        categorias.forEach(categoria => {

            selectCategoria.innerHTML += `
                <option value="${categoria}">
                    ${categoria}
                </option>
            `;

        });

    }


    // ===============================
    // ENCARGADO
    // ===============================

    else if (usuarioActivo.rol === "Encargado") {

        const categoriasPermitidas =
            (usuarioActivo.categorias || [])
            .map(categoria =>
                normalizarTexto(categoria)
            );


        categorias = categorias.filter(categoria =>
            categoriasPermitidas.includes(categoria)
        );


        categorias.forEach(categoria => {

            selectCategoria.innerHTML += `
                <option value="${categoria}">
                    ${categoria}
                </option>
            `;

        });

    }

}


// ===============================
// CARGAR MATERIALES
// ===============================

function cargarMateriales() {

    const categoriaSeleccionada =
        document.getElementById("categoria").value;

    const buscador =
        document.getElementById("materialBusqueda");

    const materialOculto =
        document.getElementById("material");

    const lista =
        document.getElementById("listaMateriales");


    if (!buscador || !materialOculto || !lista) return;


    // Limpiar selección anterior

    materialOculto.value = "";

    buscador.value = "";

    lista.innerHTML = "";


    // Si no hay categoría

    if (!categoriaSeleccionada) {

        buscador.disabled = true;

        materialesDisponibles = [];

        return;

    }


    buscador.disabled = false;


    // ===============================
    // FILTRAR POR CATEGORÍA
    // ===============================

    let materialesFiltrados = materiales;


    if (categoriaSeleccionada !== "TODAS") {

        materialesFiltrados =
            materiales.filter(material =>
                normalizarTexto(material.categoria) ===
                normalizarTexto(categoriaSeleccionada)
            );

    }


    // ===============================
    // SEGURIDAD PARA ENCARGADO
    // ===============================

    if (usuarioActivo.rol === "Encargado") {

        const categoriasPermitidas =
            (usuarioActivo.categorias || [])
            .map(categoria =>
                normalizarTexto(categoria)
            );


        materialesFiltrados =
            materialesFiltrados.filter(material =>
                categoriasPermitidas.includes(
                    normalizarTexto(material.categoria)
                )
            );

    }


    // Guardar materiales disponibles

    materialesDisponibles = materialesFiltrados;

}


// ===============================
// MOSTRAR SUGERENCIAS
// ===============================

function mostrarSugerencias(texto) {

    const lista =
        document.getElementById("listaMateriales");

    if (!lista) return;


    // No mostrar nada si está vacío

    if (!texto) {

        lista.innerHTML = "";

        return;

    }


    const textoBusqueda =
        normalizarTexto(texto);


    // ===============================
    // FILTRO POR INICIO DEL NOMBRE
    // ===============================

    const coincidencias =
        materialesDisponibles.filter(material => {

            const nombre =
                normalizarTexto(material.nombre);

            return nombre.startsWith(textoBusqueda);

        });


    lista.innerHTML = "";


    // ===============================
    // MOSTRAR RESULTADOS
    // ===============================

    coincidencias.forEach(material => {

        const indice =
            materiales.indexOf(material);

        const elemento =
            document.createElement("div");

        elemento.className =
            "opcion-material";

        elemento.textContent =
            `${normalizarTexto(material.nombre)} (${normalizarTexto(material.unidad)}) — STOCK: ${material.stock}`;


        elemento.onclick = function () {

            seleccionarMaterial(indice);

        };


        lista.appendChild(elemento);

    });

}


// ===============================
// SELECCIONAR MATERIAL
// ===============================

function seleccionarMaterial(indice) {

    const material =
        materiales[indice];

    if (!material) return;


    const buscador =
        document.getElementById("materialBusqueda");

    const materialOculto =
        document.getElementById("material");

    const lista =
        document.getElementById("listaMateriales");


    if (!buscador || !materialOculto || !lista) return;


    // Guardar índice internamente

    materialOculto.value = indice;


    // Mostrar material seleccionado

    buscador.value =
        `${normalizarTexto(material.nombre)} (${normalizarTexto(material.unidad)})`;


    // Ocultar sugerencias

    lista.innerHTML = "";

}


// ===============================
// LIMPIAR BUSCADOR
// ===============================

function limpiarBuscadorMaterial() {

    const buscador =
        document.getElementById("materialBusqueda");

    const materialOculto =
        document.getElementById("material");

    const lista =
        document.getElementById("listaMateriales");


    if (buscador) buscador.value = "";

    if (materialOculto) materialOculto.value = "";

    if (lista) lista.innerHTML = "";

}


// ===============================
// REGISTRAR SALIDA
// ===============================

function registrarSalida() {

    // Recargar datos actuales

    materiales =
        JSON.parse(localStorage.getItem("materiales")) || [];

    salidas =
        JSON.parse(localStorage.getItem("salidas")) || [];

    movimientos =
        JSON.parse(localStorage.getItem("movimientos")) || [];


    const categoria =
        document.getElementById("categoria").value;


    const indice =
        document.getElementById("material").value;


    const cantidad =
        Number(
            document.getElementById("cantidad").value
        );


    const entregado =
        document.getElementById("entregado")
            .value
            .trim();


    const observacion =
        document.getElementById("observacion")
            .value
            .trim();


    // ===============================
    // VALIDACIONES
    // ===============================

    if (!categoria) {

        alert("⚠️ Selecciona una categoría.");

        return;

    }


    if (indice === "") {

        alert("⚠️ Selecciona un material.");

        return;

    }


    if (!cantidad || cantidad <= 0) {

        alert("⚠️ Ingresa una cantidad válida.");

        return;

    }


    // ===============================
    // BUSCAR MATERIAL
    // ===============================

    const material =
        materiales[indice];


    if (!material) {

        alert("❌ No se encontró el material.");

        return;

    }


    // ===============================
    // NORMALIZAR DATOS
    // ===============================

    material.nombre =
        normalizarTexto(material.nombre);

    material.categoria =
        normalizarTexto(material.categoria);

    material.unidad =
        normalizarTexto(material.unidad);


    const categoriaNormalizada =
        normalizarTexto(categoria);


    // ===============================
    // VERIFICAR CATEGORÍA
    // ===============================

    if (
        categoriaNormalizada !== "TODAS" &&
        material.categoria !== categoriaNormalizada
    ) {

        alert(
            "❌ El material no pertenece a la categoría seleccionada."
        );

        return;

    }


    // ===============================
    // SEGURIDAD ENCARGADO
    // ===============================

    if (usuarioActivo.rol === "Encargado") {

        const categoriasPermitidas =
            (usuarioActivo.categorias || [])
            .map(categoria =>
                normalizarTexto(categoria)
            );


        if (
            !categoriasPermitidas.includes(
                material.categoria
            )
        ) {

            alert(
                "❌ No tienes permiso para sacar materiales de esta categoría."
            );

            return;

        }

    }


    // ===============================
    // VERIFICAR STOCK
    // ===============================

    if (cantidad > Number(material.stock)) {

        alert(
            `⚠️ Stock insuficiente.\n\n` +
            `Material: ${material.nombre}\n` +
            `Disponible: ${material.stock}\n` +
            `Solicitado: ${cantidad}`
        );

        return;

    }


    // ===============================
    // RESTAR STOCK
    // ===============================

    material.stock =
        Number(material.stock) - cantidad;


    // ===============================
    // ACTUALIZAR ESTADO
    // ===============================

    if (material.stock === 0) {

        material.estado =
            "🔴 AGOTADO";

    }

    else if (
        material.stock <=
        Number(material.minimo || 0)
    ) {

        material.estado =
            "🟡 POR REPONER";

    }

    else {

        material.estado =
            "🟢 DISPONIBLE";

    }


    // ===============================
    // GUARDAR MATERIAL
    // ===============================

    localStorage.setItem(
        "materiales",
        JSON.stringify(materiales)
    );


    // ===============================
    // CREAR REGISTRO DE SALIDA
    // ===============================

    const nuevaSalida = {

        material: material.nombre,

        categoria: material.categoria,

        unidad: material.unidad,

        cantidad: cantidad,

        entregado: entregado,

        registradoPor: usuarioActivo.nombre,

        usuario: usuarioActivo.usuario,

        observacion: observacion,

        fecha: new Date().toLocaleString()

    };


    salidas.push(nuevaSalida);


    localStorage.setItem(
        "salidas",
        JSON.stringify(salidas)
    );


    // ===============================
    // REGISTRAR MOVIMIENTO
    // ===============================

    const movimiento = {

        tipo: "SALIDA",

        material: material.nombre,

        categoria: material.categoria,

        unidad: material.unidad,

        cantidad: cantidad,

        usuario: usuarioActivo.usuario,

        fecha: new Date().toLocaleString(),

        observacion: observacion

    };


    movimientos.push(movimiento);


    localStorage.setItem(
        "movimientos",
        JSON.stringify(movimientos)
    );


    // ===============================
    // MENSAJE
    // ===============================

    alert(
        `✅ SALIDA REGISTRADA CORRECTAMENTE.\n\n` +
        `Material: ${material.nombre}\n` +
        `Cantidad: ${cantidad}\n` +
        `Stock restante: ${material.stock}`
    );


    // ===============================
    // LIMPIAR FORMULARIO
    // ===============================

    document.getElementById("categoria").value = "";


    limpiarBuscadorMaterial();


    const buscador =
        document.getElementById("materialBusqueda");

    if (buscador) {

        buscador.disabled = true;

    }


    document.getElementById("cantidad").value = "";

    document.getElementById("entregado").value = "";

    document.getElementById("observacion").value = "";


    // Actualizar historial

    mostrarSalidas();

}


// ===============================
// MOSTRAR HISTORIAL
// ===============================

function mostrarSalidas() {

    const tabla =
        document.getElementById("tablaSalidas");

    if (!tabla) return;


    tabla.innerHTML = "";


    salidas.forEach(salida => {

        tabla.innerHTML += `

            <tr>

                <td>
                    ${normalizarTexto(salida.material)}
                </td>

                <td>
                    ${salida.cantidad}
                </td>

                <td>
                    ${salida.entregado || ""}
                </td>

                <td>
                    ${salida.registradoPor || ""}
                </td>

                <td>
                    ${salida.observacion || ""}
                </td>

                <td>
                    ${salida.usuario || ""}
                </td>

                <td>
                    ${salida.fecha || ""}
                </td>

            </tr>

        `;

    });

}


// ===============================
// BUSCADOR DE MATERIAL
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const buscador =
            document.getElementById("materialBusqueda");

        const materialOculto =
            document.getElementById("material");

        const lista =
            document.getElementById("listaMateriales");


        if (!buscador) return;


        // ===============================
        // ESCRIBIR EN EL BUSCADOR
        // ===============================

        buscador.addEventListener(
            "input",
            function () {

                // Al modificar el texto,
                // quitar selección anterior

                materialOculto.value = "";


                const texto =
                    normalizarTexto(this.value);


                // Si está vacío,
                // no mostrar lista

                if (texto === "") {

                    lista.innerHTML = "";

                    return;

                }


                // Mostrar coincidencias

                mostrarSugerencias(texto);

            }
        );

    }
);


// ===============================
// INICIO
// ===============================

window.onload = function () {

    cargarCategorias();

    mostrarSalidas();

};