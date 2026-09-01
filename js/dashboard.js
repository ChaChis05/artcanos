// ==========================================
// USUARIO ACTIVO
// ==========================================

let usuarioActivo =
    JSON.parse(localStorage.getItem("usuarioActivo"));


// ==========================================
// VERIFICAR SESIÓN
// ==========================================

if (usuarioActivo) {

    document.getElementById("bienvenida").innerHTML =
        "👤 Bienvenido: " +
        usuarioActivo.nombre +
        " | Rol: " +
        usuarioActivo.rol;


    // ==========================================
    // OCULTAR USUARIOS PARA ENCARGADO
    // ==========================================

    if (usuarioActivo.rol !== "Administrador") {

        let tarjetaUsuarios =
            document.querySelector(".usuarios-card");

        if (tarjetaUsuarios) {

            tarjetaUsuarios.style.display = "none";

        }

    }

}
else {

    window.location.href = "index.html";

}


// ==========================================
// CERRAR SESIÓN
// ==========================================

function cerrarSesion() {

    alert("Cerrando sesión...");

    localStorage.removeItem("usuarioActivo");

    window.location.href = "index.html";

}


// ==========================================
// INICIAR DASHBOARD
// ==========================================

window.onload = function() {

    cargarEstadisticas();

};


// ==========================================
// OBTENER MATERIALES PERMITIDOS
// ==========================================

function obtenerMaterialesPermitidos(materiales) {

    // Administrador → todo
    if (usuarioActivo.rol === "Administrador") {

        return materiales;

    }


    // Encargado → solamente sus categorías
    if (usuarioActivo.rol === "Encargado") {

        const categoriasPermitidas =
            usuarioActivo.categorias || [];

        return materiales.filter(material =>
            categoriasPermitidas.includes(
                material.categoria
            )
        );

    }


    return [];

}


// ==========================================
// CARGAR ESTADÍSTICAS
// ==========================================

function cargarEstadisticas() {

    let materiales =
        JSON.parse(
            localStorage.getItem("materiales")
        ) || [];


    let entradas =
        JSON.parse(
            localStorage.getItem("entradas")
        ) || [];


    let salidas =
        JSON.parse(
            localStorage.getItem("salidas")
        ) || [];


    // ==========================================
    // FILTRAR MATERIALES SEGÚN PERMISOS
    // ==========================================

    let materialesPermitidos =
        obtenerMaterialesPermitidos(materiales);


    // ==========================================
    // FILTRAR ENTRADAS Y SALIDAS
    // ==========================================

    let entradasPermitidas =
        entradas;


    let salidasPermitidas =
        salidas;


    if (usuarioActivo.rol === "Encargado") {

        const categoriasPermitidas =
            usuarioActivo.categorias || [];


        entradasPermitidas =
            entradas.filter(entrada =>
                categoriasPermitidas.includes(
                    entrada.categoria
                )
            );


        salidasPermitidas =
            salidas.filter(salida =>
                categoriasPermitidas.includes(
                    salida.categoria
                )
            );

    }


    // ==========================================
    // CALCULAR STOCK
    // ==========================================

    let totalStock = 0;

    let bajos = 0;


    materialesPermitidos.forEach(material => {

        totalStock +=
            Number(material.stock) || 0;


        if (
            Number(material.stock) <=
            Number(material.minimo)
        ) {

            bajos++;

        }

    });


    // ==========================================
    // MOSTRAR RESULTADOS
    // ==========================================

    document.getElementById(
        "totalMateriales"
    ).innerHTML =
        materialesPermitidos.length;


    document.getElementById(
        "totalStock"
    ).innerHTML =
        totalStock;


    document.getElementById(
        "totalEntradas"
    ).innerHTML =
        entradasPermitidas.length;


    document.getElementById(
        "totalSalidas"
    ).innerHTML =
        salidasPermitidas.length;


    document.getElementById(
        "stockBajo"
    ).innerHTML =
        bajos;

}
