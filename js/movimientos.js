// ===============================
// MOVIMIENTOS ART CANOS
// ===============================


// ===============================
// DATOS
// ===============================

let movimientos =
    JSON.parse(localStorage.getItem("movimientos")) || [];

let materiales =
    JSON.parse(localStorage.getItem("materiales")) || [];

const usuarioActivo =
    JSON.parse(localStorage.getItem("usuarioActivo"));


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
// OBTENER MOVIMIENTOS PERMITIDOS
// ===============================

function obtenerMovimientosPermitidos() {

    // Administrador puede ver todo
    if (usuarioActivo.rol === "Administrador") {

        return movimientos;
    }


    // Encargado solo puede ver
    // sus categorías permitidas
    if (usuarioActivo.rol === "Encargado") {

        const categoriasPermitidas =
            (usuarioActivo.categorias || [])
                .map(categoria =>
                    normalizarTexto(categoria)
                );

        return movimientos.filter(movimiento => {

            const categoriaMovimiento =
                normalizarTexto(
                    movimiento.categoria
                );

            return categoriasPermitidas.includes(
                categoriaMovimiento
            );
        });
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


    // Reiniciar selector
    selectCategoria.innerHTML = `
        <option value="">
            Todas las categorías
        </option>
    `;


    // Obtener movimientos permitidos
    const movimientosPermitidos =
        obtenerMovimientosPermitidos();


    // Categorías únicas
    const categorias = [
        ...new Set(
            movimientosPermitidos
                .map(movimiento =>
                    normalizarTexto(
                        movimiento.categoria
                    )
                )
                .filter(categoria => categoria)
        )
    ];


    // Agregar categorías
    categorias.forEach(categoria => {

        selectCategoria.innerHTML += `
            <option value="${categoria}">
                ${categoria}
            </option>
        `;
    });
}


// ===============================
// FILTRAR POR CATEGORÍA
// ===============================

function filtrarMovimientos() {

    const categoria =
        normalizarTexto(
            document.getElementById("categoria").value
        );

    const buscador =
        document.getElementById("materialBusqueda");


    // Limpiar buscador
    if (buscador) {

        buscador.value = "";

        buscador.disabled = false;
    }


    // Obtener movimientos permitidos
    let lista =
        obtenerMovimientosPermitidos();


    // Filtrar por categoría
    if (categoria) {

        lista = lista.filter(movimiento => {

            return normalizarTexto(
                movimiento.categoria
            ) === categoria;
        });
    }


    // Mostrar resultados
    mostrarMovimientos(lista);
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

    if (!buscador) return;


    const texto =
        normalizarTexto(buscador.value);


    // Obtener movimientos permitidos
    let lista =
        obtenerMovimientosPermitidos();


    // Filtrar por categoría
    if (categoria) {

        lista = lista.filter(movimiento => {

            return normalizarTexto(
                movimiento.categoria
            ) === categoria;
        });
    }


    // Si no escribió nada,
    // mostrar nuevamente la lista
    // correspondiente a la categoría
    if (texto === "") {

        mostrarMovimientos(lista);

        return;
    }


    // Filtrar por material
    lista = lista.filter(movimiento => {

        const material =
            normalizarTexto(
                movimiento.material
            );

        return material.startsWith(texto);
    });


    mostrarMovimientos(lista);
}


// ===============================
// MOSTRAR MOVIMIENTOS
// ===============================

function mostrarMovimientos(lista = null) {

    const tabla =
        document.getElementById(
            "tablaMovimientos"
        );

    if (!tabla) return;


    // Actualizar movimientos
    movimientos =
        JSON.parse(
            localStorage.getItem("movimientos")
        ) || [];


    let movimientosMostrar =
        lista !== null
            ? lista
            : obtenerMovimientosPermitidos();


    tabla.innerHTML = "";


    // Mostrar movimientos
    movimientosMostrar.forEach(movimiento => {

        tabla.innerHTML += `
            <tr>

                <td>
                    ${movimiento.fecha || ""}
                </td>

                <td>
                    ${normalizarTexto(
                        movimiento.tipo
                    )}
                </td>

                <td>
                    ${normalizarTexto(
                        movimiento.material
                    )}
                </td>

                <td>
                    ${movimiento.cantidad || ""}
                </td>

                <td>
                    ${movimiento.entregado || ""}
                </td>

                <td>
                    ${movimiento.registradoPor ||
                      movimiento.usuario ||
                      ""}
                </td>

            </tr>
        `;
    });
}


// ===============================
// INICIO
// ===============================

window.onload = function () {

    // Cargar categorías
    cargarCategorias();


    const buscador =
        document.getElementById(
            "materialBusqueda"
        );


    if (buscador) {

        // El buscador empieza habilitado
        buscador.disabled = false;


        // Buscar mientras escribe
        buscador.addEventListener(
            "input",
            buscarMaterial
        );
    }


    // IMPORTANTE:
    // Al entrar sí mostramos el historial
    mostrarMovimientos();
};
