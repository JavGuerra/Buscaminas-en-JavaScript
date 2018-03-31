/*
 * Juego de Buscaminas v.1.0 por Javier Guerra
 */

/*
 * Variables globales
 */

var ancho = 0; // ancho del tablero
var antAncho = 0; // ancho de la partida anterior
var alto = 0; // alto del tablero
var antAlto = 0; // alto de la partida anterior
var intentos = 0; // intentos restantes
var minas = 0; // número de minas en el tablero
var encontradas = 0; // número de minas encontradas
var tablaMinas; // listado de posición de las minas mediante id
var miTablero; // tablero completo
var casillasTablero; // casillas del tablero
var l = 0; // cantidad de casillas del tablero
var areaMensaje; // área para mensajes


/* 
 * Funciones para poner y quitar eventos
 */


/**
 * Coloca en un elemento un evento que dispara un funcion
 * @returns {function} Función cross-browsing
 */
var ponerEvento = function () {
    /**
     * Preparado para navegadores w3c
     * @param {object} elemento  Elemento HTML
     * @param {object} evento    Evento disparador
     * @param {function} miFuncion Funcion a ejecutar
     */
    function w3c_ponerEvento(elemento, evento, miFuncion) {
        elemento.addEventListener(evento, miFuncion, false);
    }

    /**
     * Preparado para navegadores Internet Explorer
     * @param {object} elemento  Elemento HTML
     * @param {object} evento    Evento disparador
     * @param {function} miFuncion Funcion a ejecutar
     */
    function ie_ponerEvento(elemento, evento, miFuncion) {
        var fx = function () {
            miFuncion.call(elemento);
        };
        elemento.attachEvent('on' + evento, fx);
    }

    if (typeof window.addEventListener !== 'undefined') {
        return w3c_ponerEvento;
    } else if (typeof window.attachEvent !== 'undefined') {
        return ie_ponerEvento;
    }
}();


/**
 * Elimina en un elemento un evento que dispara un funcion
 * @returns {function} Función cross-browsing
 */
var quitarEvento = function () {
    /**
     * Preparado para navegadores w3c
     * @param {object} elemento  Elemento HTML
     * @param {object} evento    Evento disparador
     * @param {function} miFuncion Funcion a eliminar
     */
    function w3c_quitarEvento(elemento, evento, miFuncion) {
        elemento.removeEventListener(evento, miFuncion, false);
    }

    /**
     * Preparado para navegadores Internet Explorer
     * @param {object} elemento  Elemento HTML
     * @param {object} evento    Evento disparador
     * @param {function} miFuncion Funcion a eliminar
     */
    function ie_quitarEvento(elemento, evento, miFuncion) {
        var fx = function () {
            miFuncion.call(elemento);
        };
        elemento.detachEvent('on' + evento, fx);
    }

    if (typeof window.removeEventListener !== 'undefined') {
        return w3c_quitarEvento;
    } else if (typeof window.detachEvent !== 'undefined') {
        return ie_quitarEvento;
    }
}();


/* 
 * Funciones para poner y quitar clases
 */


/**
 * Coloca una clase a un elemento HTML
 * @returns {function} Función cross-browsing
 */
var ponerClase = function () {
    /**
     * Preparado para navegadores w3c
     * @param {object} elemento  Elemento HTML
     * @param {object} clase    Clase a colocar
     */
    function w3c_ponerClase(elemento, clase) {
        elemento.classList.add(clase);
    }

    /**
     * Preparado para navegadores Internet Explorer
     * @param {object} elemento  Elemento HTML
     * @param {object} clase    Clase a colocar
     */
    function ie_ponerClase(elemento, clase) {
        elemento.className = clase;
    }

    if (document.documentElement.classList) {
        return w3c_ponerClase;
    } else {
        return ie_ponerClase;
    }
}();


/**
 * Quita una clase de un elemento HTML
 * @returns {function} Función cross-browsing
 */
var quitarClase = function () {
    /**
     * Preparado para navegadores w3c
     * @param {object} elemento  Elemento HTML
     * @param {object} clase    Clase a quitar
     */
    function w3c_quitarClase(elemento, clase) {
        elemento.classList.remove(clase);
    }

    /**
     * Preparado para navegadores Internet Explorer
     * @param {object} elemento  Elemento HTML
     * @param {object} clase    Clase a quitar
     */
    function ie_quitarClase(elemento, clase) {
        var regexp = new RegExp("(^|\\s)" + clase + "(\\s|$)", "g");
        elemento.className = elemento.className.replace(regexp, "$2");
    }

    if (document.documentElement.classList) {
        return w3c_quitarClase;
    } else {
        return ie_quitarClase;
    }
}();


/**
 * Comprueba si existe una clase en un elemento HTML
 * @returns {function} Función cross-browsing
 */
var contieneClase = function () {
    /**
     * Preparado para navegadores w3c
     * @param {object} elemento  Elemento HTML
     * @param {object} clase    Clase a comprobar
     * @returns {boolean} ¿existe la clase?
     */
    function w3c_contieneClase(elemento, clase) {
        return elemento.classList.contains(clase);
    }

    /**
     * Preparado para navegadores Internet Explorer
     * @param {object} elemento  Elemento HTML
     * @param {object} clase    Clase a comprobar
     * @returns {boolean} ¿existe la clase?
     */
    function ie_contieneClase(elemento, clase) {
        var regexp = new RegExp("(^|\\s)" + clase + "(\\s|$)", "g");
        return regexp.test(elemento.className);
    }

    if (document.documentElement.classList) {
        return w3c_contieneClase;
    } else {
        return ie_contieneClase;
    }
}();



/************************************+***
 * Cuando se cargue la página, iniciar. *
 *************************************++*/
ponerEvento(window, "load", iniciar);
/*************************************+*/



/**
 * Prepara la interfaz
 */
function iniciar() {

    areaMensaje = document.getElementById("mensaje");
    // Limpia el formulario para cuando se recarga la página
    document.getElementById("formulario").reset();
    // Eventos de teclado
    ponerEvento(document.getElementById("ancho"), "keypress", saltoEnter);
    ponerEvento(document.getElementById("alto"), "keypress", saltoEnter);
    // Eventos de la capa de ayuda
    ponerEvento(document.getElementById("btnAyuda"), 'click', ayudaOff);
    ponerEvento(document.getElementById("btnAyuda"), 'mouseover', puntApuntador);
    ponerEvento(document.getElementById("btnInfo"), 'click', ayudaOn);
    ponerEvento(document.getElementById("btnInfo"), 'mouseover', puntApuntador);
    // Coloca el foco en el primer campo del formulario
    document.getElementById("ancho").focus();
    // Arranca el juego al hacer clic en el botón
    ponerEvento(document.getElementById("jugar"), 'click', programa);
}


/**
 * Cada vez que hacemos clic en el botón de Jugar
 */
function programa() {

    // Si los valores de entrada son correctos...
    if (validaInputs()) {

        // Si vamos a empezar una nueva partida...
        if (validaNuevaPartida()) {

            // En caso de que demos al boton 'Jugar' pero no confirmemos nueva partida...
            antAncho = ancho;
            antAlto = alto;

            // Re-inicializa variables del juego
            intentos = Math.round(ancho * alto / 5);
            minas = Math.round(ancho * alto / 10);
            encontradas = 0; // restaura el valor inicial

            // Actualiza los valores de los campos
            document.getElementById("intentos").setAttribute('value', intentos);
            document.getElementById("minas").setAttribute('value', encontradas);

            // El área de Instrucciones ya no es necesaria, y se oculta
            ayudaOff();
            mensaje("Empieza la partida. Hay " + minas + " minas.", "sucess");

            // Si existe el tablero, se elimina
            if (document.getElementById("miTablero")) {
                document.getElementById("tablero").removeChild(document.getElementById("miTablero"));
            }
            // y luego se genera el nuevo tablero
            pintaTablero();
            // Se asignan las minas a las casillas del tablero
            asignaMinas();
            // Se asignan los eventos del tablero
            asignaEventos();
        }
    }

} // fin programa()


/*
 * Funciones para la validación de datos de entrada
 */


/**
 * Valida los valores de entrada de los campos del formulario
 * @returns {boolean} ¿Los valores son correctos?
 */
function validaInputs() {
    var noError = true;
    var inputAncho = document.getElementById("ancho");
    var inputAlto = document.getElementById("alto");
    var grupoAncho = inputAncho.parentNode;
    var grupoAlto = inputAlto.parentNode;
    var iconoAncho = inputAncho.nextElementSibling;
    var iconoAlto = inputAlto.nextElementSibling;

    ancho = inputAncho.value;
    alto = inputAlto.value;

    // Limpia posibles errores anteriores
    inputError(false, grupoAncho, iconoAncho);
    inputError(false, grupoAlto, iconoAlto);

    // Compruebo los campos de abajo a arriba para dejar el foco en el primer campo erróneo
    if (!validaEnteroPos(alto, 5, 40)) {
        noError = false;
        inputError(true, grupoAlto, iconoAlto);
    }
    if (!validaEnteroPos(ancho, 5, 40)) {
        noError = false;
        inputError(true, grupoAncho, iconoAncho);
    }

    return noError;

} // fin validaImputs()


/**
 * Comprueba si un valor esta en un rango determinado entero positivo
 * @param   {number} valor Entero a evaluar
 * @param   {number} min   Valor mínimo del rango
 * @param   {number} max   Valor máximo del rango
 * @returns {boolean} ¿Está en rango?
 */
function validaEnteroPos(valor, min, max) {
    // min y max deben ser valores enteros, positivos y mayores que cero
    var ok = true;
    // Comprueba si valor está en rango y no es decimal, cero o negativo...
    if (valor < min || valor > max || valor % 1 !== 0 || valor <= 0) {
        ok = false;
    }
    return ok;
}


/**
 * Pone o quita error en campo de formulario
 * @param {boolean} hayError ¿error?
 * @param {object}   grupo    label + input
 * @param {object}   icono    aviso visual
 */
function inputError(hayError, grupo, icono) {
    // Si error, marcar campo, sino quitar marca de error
    if (hayError) {
        ponerClase(grupo, "has-error");
        quitarClase(icono, "ocultar");
        grupo.firstElementChild.nextElementSibling.focus();
        mensaje("¡ ERROR !", "danger");
    } else {
        quitarClase(grupo, "has-error");
        ponerClase(icono, "ocultar");
    }
}


/**
 * Confirma que queremos empezar otra partida
 * @returns {boolean} ¿Empezar otra partida?
 */
function validaNuevaPartida() {
    var msgConfirma = "¿Está seguro/a?\n\nVa a iniciar una nueva partida, y concluirá la partida actual.";
    var ok = true;
    // Si no se trata de la primera partida o no hemos concluido la partida actual
    if (minas !== 0 && intentos !== 0 && encontradas != minas) {
        console.log("minas " + minas + ", intentos " + intentos +  ", encontradas " + encontradas);
        if (!confirm(msgConfirma)) {
            ok = false;
            // Se restauran los valores de la partida en juego
            document.getElementById("ancho").value = antAncho;
            document.getElementById("alto").value = antAlto;
        }
    }
    return ok;
}


/*
 * Funciones para la ejecución del juego
 */


/**
 * Crea el tablero del juego con las medidas en casillas introducidas
 */
function pintaTablero() {
    var miFila, miCelda;
    var i, j, fila, celda;
    // Se crea la tabla
    miTablero = creaElementoId("table", "miTablero");
    ponerClase(miTablero, "tablerojuego");
    // Se crean las filas
    for (i = 0; i < alto; i++) {
        fila = "F" + i;
        miFila = creaElementoId("tr", fila);
        // Se crean las celdas
        for (j = 0; j < ancho; j++) {
            celda = fila + "C" + j;
            miCelda = creaElementoId("td", celda);
            miFila.appendChild(miCelda);
        }
        // se añade la fila con las celdas a la tabla
        miTablero.appendChild(miFila);
    }
    // Se añade la tabla completa a la capa tablero
    document.getElementById("tablero").appendChild(miTablero);

    // Obteniendo las celdas de la tabla
    casillasTablero = miTablero.getElementsByTagName("td");
    l = casillasTablero.length;
} // fin pintatablero()


/**
 * Crea elementos con los métodos DOM y añade id
 * @param   {object} elemento Elemento HTML
 * @param   {string} id       Identificador HTML
 * @returns {object} Nuevo elemento
 */
function creaElementoId(elemento, id) {
    var nuevoElemento;
    nuevoElemento = document.createElement(elemento);
    nuevoElemento.setAttribute("id", id);
    return nuevoElemento;
}


/**
 * Crea un array con los identificadores de las casillas
 * del tablero donde se asignan las minas
 */
function asignaMinas() {
    var fila, columna, numero, celda;
    var i = 0;
    tablaMinas = [];
    do {
        numero = Math.floor(Math.random() * ancho * alto);
        // Posición de la mina en el tablero
        fila = Math.trunc(numero / ancho);
        columna = numero % ancho;
        celda = "F" + fila + "C" + columna;
        // ¿Ya hay una mina en esa celda?
        if (tablaMinas.indexOf(celda) == -1) {
            tablaMinas[i] = celda;
            i++;
        }
    } while (i < minas);
}


/**
 * Pone eventos a las casillas del tablero
 */
function asignaEventos() {
    var i, celda;

    // Poniendo los eventos el puntero y del clic
    for (i = 0; i < l; i++) {
        celda = casillasTablero[i];
        ponerEvento(celda, 'click', compruebaCelda);
        ponerEvento(celda, 'mouseover', puntApunta);
    }
}


/**
 * Comprueba el contenido de la casilla al hacer clic sobre ella
 * @param {object} evento Evento que generó el clic
 */
function compruebaCelda(evento) {
    var elemento;
    var celdaEv = evento.target.id; // id del elemento que generó el evento
    var miCelda = document.getElementById(celdaEv);

    // ¿La casilla sobre la que se hizo clic esta vacía? (no tiene minas)
    if (tablaMinas.indexOf(celdaEv) == -1) {
        ponerClase(miCelda, "selec");
        document.getElementById("intentos").setAttribute('value', --intentos);
        mensaje("No hay mina. Te quedan " + (minas - encontradas) + " minas.", "warning");
    } else {
        // Poner dibujo de explosión de mina en la casilla
        quitarClase(miCelda, "hay");
        ponerClase(miCelda, "mina");
        elemento = creaElementoId("span", "");
        ponerClase(elemento, "glyphicon");
        ponerClase(elemento, "glyphicon-fire");
        miCelda.appendChild(elemento);
        // Alertar de mina encontrada y actualizar datos
        alert("¡¡¡ BOOM !!!");
        mensaje("Mina encontrada. Te quedan " + (minas - ++encontradas) + " minas.", "info");
        document.getElementById("minas").setAttribute('value', encontradas);
    }

    // quitar los eventos asociados a la casilla
    quitarEvento(miCelda, 'click', compruebaCelda);
    quitarEvento(miCelda, 'mouseover', puntApunta);
    ponerEvento(miCelda, 'mouseover', puntProhibido);

    // ¿Se ha terminado ya la partida?
    compruebaTablero(intentos, encontradas, minas);
}


/**
 * Comprueba si se ha terminado o no la partida
 * @param {number} intentos    intentos restantes
 * @param {number} encontradas minas encontradas
 * @param {number} minas       minas que quedan
 */
function compruebaTablero(intentos, encontradas, minas) {
    var i, celda, elemento, miCelda;

    // Si no quedan intentos o se han encontrado todas las minas...
    if (intentos === 0 || encontradas == minas) {

        // Quita los eventos de todo el tablero
        for (i = 0; i < l; i++) {
            celda = casillasTablero[i];
            quitarEvento(celda, 'click', compruebaCelda);
            quitarEvento(celda, 'mouseover', puntApunta);
            quitarEvento(celda, 'mouseover', puntProhibido);
            ponerEvento(celda, 'mouseover', puntDefecto);
        }

        // Si se encontraron todas las minas...
        if (encontradas == minas) {
            alert("¡¡¡ Enhorabuena !!!");
            mensaje("Has encontrado todas las minas. ¿Otra partida?", "sucess");
        } else {
            // Si nos quedamos sin intentos...
            alert("GAME OVER");
            mensaje("Quedaron por encontrar " + (minas - encontradas) + " de las " + minas + " minas. ¿Probamos otra vez?", "danger");

            // Mostrar dónde estaban las minas no encontradas
            for (i in tablaMinas) {
                miCelda = document.getElementById(tablaMinas[i]);
                if (!contieneClase(miCelda, "mina")) {
                    quitarClase(miCelda, "hay");
                    ponerClase(miCelda, "bandera");
                    elemento = creaElementoId("span", "");
                    ponerClase(elemento, "glyphicon");
                    ponerClase(elemento, "glyphicon-flag");
                    miCelda.appendChild(elemento);
                }
            }
        }
    }
}


/* 
 * Funciones de la interfaz
 */


/**
 * [[Description]]
 * @param {object} evento [[Description]]
 */
function saltoEnter(evento) {
    if (evento.keyCode == 13) { // Código de la tecla Enter
        // Si estamos en el campo "ancho" saltamos a "alto", sino a "jugar"
        if (evento.target.id == "ancho") {
            document.getElementById("alto").focus();
        } else {
            document.getElementById("jugar").focus();
        }
    }
}


/**
 * Pone el estilo del puntero del ratón en cruz
 */
function puntApunta() {
    this.style.cursor = 'crosshair';
}


/**
 * Pone el estilo del puntero del ratón en prohibido
 */
function puntProhibido() {
    this.style.cursor = 'not-allowed';
}


/**
 * Pone el estilo del puntero del ratón en apuntador
 */
function puntApuntador() {
    this.style.cursor = 'pointer';
}


/**
 * Pone el estilo del puntero del ratón por defecto
 */
function puntDefecto() {
    this.style.cursor = 'default';
}


/**
 * Activa la capa de ayuda
 */
function ayudaOn() {
    var i, miCelda;
    quitarClase(document.getElementById("ayuda"), "ocultar");
    ponerClase(document.getElementById("btnInfo"), "ocultar");

    // Si aún tenemos intentos, poner la ayuda visual en el tablero
    if (intentos !== 0) {
        for (i in tablaMinas) {
            miCelda = document.getElementById(tablaMinas[i]);
            if (!contieneClase(miCelda, "mina")) {
                ponerClase(miCelda, "hay");
            }
        }
    }
}


/**
 * Desactiva la capa de ayuda
 */
function ayudaOff() {
    var i, miCelda;
    ponerClase(document.getElementById("ayuda"), "ocultar");
    quitarClase(document.getElementById("btnInfo"), "ocultar");

    // Si aún tenemos intentos, quitar la ayuda visual en el tablero
    if (intentos !== 0) {
        for (i in tablaMinas) {
            miCelda = document.getElementById(tablaMinas[i]);
            if (!contieneClase(miCelda, "mina")) {
                quitarClase(miCelda, "hay");
            }
        }
    }
}


/**
 * Cambia los mensajes y el color del mensaje en la capa de mensajes
 * @param {string} texto Mensaje a mostrar
 * @param {string} tipo  Tipo de mensaje
 */
function mensaje(texto, tipo) {
    // Quita el tipo de mensaje 
    quitarClase(areaMensaje, "alert-success");
    quitarClase(areaMensaje, "alert-info");
    quitarClase(areaMensaje, "alert-warning");
    quitarClase(areaMensaje, "alert-danger");
    // Pone el tipo de mensaje indicado
    switch (tipo) {
        case "sucess":
            ponerClase(areaMensaje, "alert-success");
            break;
        case "info":
            ponerClase(areaMensaje, "alert-info");
            break;
        case "warning":
            ponerClase(areaMensaje, "alert-warning");
            break;
        default:
            ponerClase(areaMensaje, "alert-danger");
    }
    // Pone el mensaje
    document.getElementById("mensajetexto").firstChild.nodeValue = texto;
}
