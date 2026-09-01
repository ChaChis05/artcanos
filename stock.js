// ===============================
// STOCK ART CANOS
// ===============================


// ===============================
// DATOS
// ===============================

let materiales =
    JSON.parse(localStorage.getItem("materiales")) || [];

const usuarioActivo =
    JSON.parse(localStorage.getItem("usuarioActivo"));


// ===============================
// VERIFICAR SESIÓN
// ===============================

if (!usuarioActivo) {

    alert("⚠️ Debes iniciar sesión.");

    window.location.href = "index.html";
}


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
// OBTENER MATERIALES PERMITIDOS
// ===============================

function obtenerMaterialesPermitidos() {

    // Administrador puede ver todo
    if (usuarioActivo.rol === "Administrador") {

        return materiales;
    }


    // Encargado solamente sus categorías
    if (usuarioActivo.rol === "Encargado") {

        const categoriasPermitidas =
            usuarioActivo.categorias || [];

        return materiales.filter(material =>

            categoriasPermitidas.some(categoria =>

                normalizarTexto(categoria) ===
                normalizarTexto(material.categoria)

            )

        );
    }


    return [];
}


// ===============================
// CARGAR CATEGORÍAS
// ===============================

function cargarCategorias() {

    const selectCategoria =
        document.getElementById("categoria");

    if (!selectCategoria) return;


    selectCategoria.innerHTML = `
        <option value="TODAS">
            Todas las categorías
        </option>
    `;


    const materialesPermitidos =
        obtenerMaterialesPermitidos();


    const categorias = [
        ...new Set(

            materialesPermitidos

                .map(material =>
                    normalizarTexto(material.categoria)
                )

                .filter(categoria =>
                    categoria !== ""
                )

        )
    ];


    categorias.forEach(categoria => {

        selectCategoria.innerHTML += `
            <option value="${categoria}">
                ${categoria}
            </option>
        `;

    });
}


// ===============================
// MOSTRAR STOCK
// ===============================

function mostrarStock(lista) {

    const tabla =
        document.getElementById("tablaStock");

    if (!tabla) return;


    tabla.innerHTML = "";


    if (!lista || lista.length === 0) {
        return;
    }


    lista.forEach(material => {

        const stock =
            Number(material.stock) || 0;

        const minimo =
            Number(material.minimo) || 0;


        let claseEstado = "";


        // ===============================
        // DETERMINAR ESTADO
        // ===============================

        if (stock <= 0) {

            claseEstado = "agotado";

        }

        else if (stock <= minimo) {

            claseEstado = "bajo";

        }

        else {

            claseEstado = "disponible";

        }


        tabla.innerHTML += `

            <tr>

                <td>
                    ${normalizarTexto(material.nombre)}
                </td>

                <td>
                    ${normalizarTexto(material.categoria)}
                </td>

                <td>
                    ${normalizarTexto(material.unidad)}
                </td>

                <td>
                    ${stock}
                </td>

                <td class="${claseEstado}">
                    ${material.estado || ""}
                </td>

            </tr>

        `;

    });

}


// ===============================
// ACTUALIZAR RESUMEN
// ===============================

function actualizarResumen() {

    const materialesPermitidos =
        obtenerMaterialesPermitidos();


    let disponibles = 0;

    let bajos = 0;

    let agotados = 0;


    materialesPermitidos.forEach(material => {

        const stock =
            Number(material.stock) || 0;

        const minimo =
            Number(material.minimo) || 0;


        if (stock <= 0) {

            agotados++;

        }

        else if (stock <= minimo) {

            bajos++;

        }

        else {

            disponibles++;

        }

    });


    document.getElementById("total").textContent =
        materialesPermitidos.length;

    document.getElementById("disponibles").textContent =
        disponibles;

    document.getElementById("bajos").textContent =
        bajos;

    document.getElementById("agotados").textContent =
        agotados;

}


// ===============================
// FILTRAR POR CATEGORÍA
// ===============================

function filtrarStock() {

    const selectCategoria =
        document.getElementById("categoria");

    const buscador =
        document.getElementById("materialBusqueda");


    const categoria =
        normalizarTexto(
            selectCategoria.value
        );


    // Limpiar buscador
    buscador.value = "";


    // Obtener materiales permitidos
    let lista =
        obtenerMaterialesPermitidos();


    // ===============================
    // TODAS LAS CATEGORÍAS
    // ===============================

    if (categoria === "TODAS") {

        mostrarStock(lista);

        buscador.disabled = false;

        return;
    }


    // ===============================
    // CATEGORÍA ESPECÍFICA
    // ===============================

    lista = lista.filter(material =>

        normalizarTexto(material.categoria) ===
        categoria

    );


    buscador.disabled = false;

    mostrarStock(lista);

}


// ===============================
// BUSCAR MATERIAL
// ===============================

function buscarMaterial() {

    const categoria =
        normalizarTexto(
            document.getElementById("categoria").value
        );


    const buscador =
        document.getElementById("materialBusqueda");


    const texto =
        normalizarTexto(
            buscador.value
        );


    // Obtener materiales permitidos
    let lista =
        obtenerMaterialesPermitidos();


    // ===============================
    // FILTRAR CATEGORÍA
    // ===============================

    if (
        categoria !== "" &&
        categoria !== "TODAS"
    ) {

        lista = lista.filter(material =>

            normalizarTexto(material.categoria) ===
            categoria

        );

    }


    // ===============================
    // BUSCADOR VACÍO
    // ===============================

    if (texto === "") {

        mostrarStock(lista);

        return;
    }


    // ===============================
    // FILTRAR MATERIAL
    // ===============================

    lista = lista.filter(material =>

        normalizarTexto(material.nombre)
            .startsWith(texto)

    );


    // ===============================
    // MOSTRAR RESULTADOS
    // ===============================

    mostrarStock(lista);

}


// ===============================
// INICIO
// ===============================

window.onload = function () {

    cargarCategorias();

    actualizarResumen();


    const selectCategoria =
        document.getElementById("categoria");

    const buscador =
        document.getElementById(
            "materialBusqueda"
        );


    // ===============================
    // CAMBIO DE CATEGORÍA
    // ===============================

    if (selectCategoria) {

        selectCategoria.addEventListener(
            "change",
            filtrarStock
        );

    }


    // ===============================
    // ESCRIBIR EN BUSCADOR
    // ===============================

    if (buscador) {

        buscador.disabled = false;

        buscador.addEventListener(
            "input",
            buscarMaterial
        );

    }


    // ===============================
    // MOSTRAR STOCK AL ENTRAR
    // ===============================

    mostrarStock(
        obtenerMaterialesPermitidos()
    );

};