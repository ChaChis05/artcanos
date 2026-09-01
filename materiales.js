// ==========================================
// MATERIALES
// ==========================================

let materiales =
    JSON.parse(localStorage.getItem("materiales")) || [];


// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizarTexto(texto) {

    return texto
        .trim()
        .toUpperCase()
        .replace(/\s+/g, " ");

}


// ==========================================
// GUARDAR MATERIAL
// ==========================================

function guardarMaterial() {

    // ======================================
    // OBTENER DATOS
    // ======================================

    let nombre =
        document.getElementById("nombre").value;

    let categoria =
        document.getElementById("categoria").value;

    let unidad =
        document.getElementById("unidad").value;

    let stock =
        Number(document.getElementById("stock").value);

    let minimo =
        Number(document.getElementById("minimo").value);


    // ======================================
    // VALIDAR NOMBRE
    // ======================================

    if (!nombre.trim()) {

        alert("⚠️ Ingresa el nombre del material.");

        return;

    }


    // ======================================
    // NORMALIZAR
    // ======================================

    nombre = normalizarTexto(nombre);

    categoria = normalizarTexto(categoria);

    unidad = normalizarTexto(unidad);


    // ======================================
    // VERIFICAR MATERIAL DUPLICADO
    // ======================================

    let materialExiste =
        materiales.some(material =>
            normalizarTexto(material.nombre) === nombre
        );


    if (materialExiste) {

        alert(
            "⚠️ Este material ya existe.\n\n" +
            "No puedes registrarlo nuevamente."
        );

        return;

    }


    // ======================================
    // DETERMINAR ESTADO
    // ======================================

    let estado;


    if (stock == 0) {

        estado = "🔴 AGOTADO";

    }

    else if (stock <= minimo) {

        estado = "🟡 POR REPONER";

    }

    else {

        estado = "🟢 DISPONIBLE";

    }


    // ======================================
    // CREAR MATERIAL
    // ======================================

    materiales.push({

        nombre: nombre,

        categoria: categoria,

        unidad: unidad,

        stock: stock,

        minimo: minimo,

        estado: estado

    });


    // ======================================
    // GUARDAR
    // ======================================

    localStorage.setItem(
        "materiales",
        JSON.stringify(materiales)
    );


    // ======================================
    // ACTUALIZAR TABLA
    // ======================================

    mostrarMateriales();


    // ======================================
    // LIMPIAR FORMULARIO
    // ======================================

    document.getElementById("nombre").value = "";

    document.getElementById("stock").value = "";

    document.getElementById("minimo").value = "";


    alert("✅ Material registrado correctamente.");

}


// ==========================================
// MOSTRAR MATERIALES
// ==========================================

function mostrarMateriales() {

    let tabla =
        document.getElementById("tablaMateriales");

    tabla.innerHTML = "";


    materiales.forEach(material => {

        tabla.innerHTML += `

            <tr>

                <td>
                    ${material.nombre}
                </td>

                <td>
                    ${material.categoria}
                </td>

                <td>
                    ${material.stock}
                </td>

                <td>
                    ${material.estado}
                </td>

            </tr>

        `;

    });

}


// ==========================================
// AL CARGAR LA PÁGINA
// ==========================================

window.onload = function() {

    mostrarMateriales();

};