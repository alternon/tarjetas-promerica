var responseJson;
var frm;
var tipoCambio;
var haveCaptcha = false;
var captchaIsValid = false;

/* ==========================================================================
   Validar formularios
   ========================================================================== */

/** Funciones utiles **/
var is_only_text = function (word) {
    for (var i = 0; i < word.length; i++) {
        if (/[a-z]/.test(word[i].toLowerCase()) == false && word[i] != " ") {
            return false;
        }
    }
    return true;
}

var is_only_number = function (number) {
    for (var i = 0; i < number.length; i++) {
        if (/[0-9]/.test(number[i]) == false) {
            return false;
        }
    }
    return true;
}

var validate_characters_identificacion = function (word) {
    for (var i = 0; i < word.length; i++) {
        if (/[a-zA-Z0-9\-]$/.test(word[i]) == false || word[i] == " ") {
            return false;
        }
    }
    return true;
}

var get_max_length_message = function (length) {
    return "Este campo permite " + length + " caracteres como m&aacute;ximo.";
}

var get_min_length_message = function (length) {
    return "Este campo requiere como m&iacute;nimo " + length + " caracteres";
}

var get_min_money_message = function (money) {
    return "Este campo requiere como m&iacute;nimo un monto de " + money;
}

/** Variables mensajes principales **/

var numberonly_max_length_10 = ["ingreso", "egreso", "monto", "plazo", "valorPrestamo", "montoPrima", "valorVivienda"];

var required_txt = "Este campo es requerido.",
    valorPrestamo_txt = "Favor ingresar el valor del pr&eacute;stamo.",
    email_txt = "",
    max_money_length_txt = "",
    identificacion_txt = "",
    centro_de_trabajo_txt = "",
    textonly_text = "",
    min_money_txt = "",
    numberonly_txt = "Solo se permiten n&uacute;meros en este campo.",
    tel_txt = "Solo se permiten n&uacute;meros en este campo y requiere 8 caracteres.",
    currency_txt = "Solo se permiten n&uacute;meros en este campo.",
    date_txt = "Favor ingresar una fecha v&aacute;lida: dd/mm/yyyy.";

/** GETTERS **/
var get_email_txt = function () {
    return email_txt;
};

var get_textonly_txt = function () {
    return textonly_txt;
};

var get_currency_txt = function () {
    return currency_txt;
};

var get_identificacion_txt = function () {
    return identificacion_txt;
};

var get_numberonly_txt = function () {
    return numberonly_txt;
};

var get_centro_de_trabajo_txt = function () {
    return centro_de_trabajo_txt;
};

var get_tel_txt = function () {
    return tel_txt;
};

var get_max_money_length_txt = function () {
    return max_money_length_txt;
}

var get_min_money_txt = function () {
    return min_money_txt;
}

/***** Mensajes utiles*****/
var valid_mail_message = "Favor ingresar un email v&aacute;lido.",
    onlytext_message = "Solo se permiten letras.",
    no_white_space_message = "No debe haber un espacio en blanco al final del campo.",
    only_numbers_message = "Solo se permiten n&uacute;meros en este campo.",
    identificacion_only_message = "Solo se permiten n&uacute;meros, letras y guiones.";


/** Esto se hace para modificar el mensaje por defecto de jquery. **/
jQuery.extend(jQuery.validator.messages, {
    email: valid_mail_message,
    min: "El valor m&iacute;nimo a ingresar es {0}",
    max: "El valor m&aacute;ximo a ingresar es {0}"
});


/************************ ==== RULES ===== ************************************************/

jQuery.validator.addMethod("dpi_rule", function (value, element, min) {
    var cui = value;

    if (!cui) {
        return false;
    }

    var cuiRegExp = /^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/;

    if (!cuiRegExp.test(cui)) {
        return false;
    }

    cui = cui.replace(/\s/, '');
    var depto = parseInt(cui.substring(9, 11), 10);
    var muni = parseInt(cui.substring(11, 13));
    var numero = cui.substring(0, 8);
    var verificador = parseInt(cui.substring(8, 9));

    // Se asume que la codificación de Municipios y 
    // departamentos es la misma que esta publicada en 
    // http://goo.gl/EsxN1a

    // Listado de municipios actualizado segun:
    // http://goo.gl/QLNglm

    // Este listado contiene la cantidad de municipios
    // existentes en cada departamento para poder 
    // determinar el código máximo aceptado por cada 
    // uno de los departamentos.
    var munisPorDepto = [
        /* 01 - Guatemala tiene:      */ 17 /* municipios. */,
        /* 02 - El Progreso tiene:    */  8 /* municipios. */,
        /* 03 - Sacatepéquez tiene:   */ 16 /* municipios. */,
        /* 04 - Chimaltenango tiene:  */ 16 /* municipios. */,
        /* 05 - Escuintla tiene:      */ 13 /* municipios. */,
        /* 06 - Santa Rosa tiene:     */ 14 /* municipios. */,
        /* 07 - Sololá tiene:         */ 19 /* municipios. */,
        /* 08 - Totonicapán tiene:    */  8 /* municipios. */,
        /* 09 - Quetzaltenango tiene: */ 24 /* municipios. */,
        /* 10 - Suchitepéquez tiene:  */ 21 /* municipios. */,
        /* 11 - Retalhuleu tiene:     */  9 /* municipios. */,
        /* 12 - San Marcos tiene:     */ 30 /* municipios. */,
        /* 13 - Huehuetenango tiene:  */ 32 /* municipios. */,
        /* 14 - Quiché tiene:         */ 21 /* municipios. */,
        /* 15 - Baja Verapaz tiene:   */  8 /* municipios. */,
        /* 16 - Alta Verapaz tiene:   */ 17 /* municipios. */,
        /* 17 - Petén tiene:          */ 14 /* municipios. */,
        /* 18 - Izabal tiene:         */  5 /* municipios. */,
        /* 19 - Zacapa tiene:         */ 11 /* municipios. */,
        /* 20 - Chiquimula tiene:     */ 11 /* municipios. */,
        /* 21 - Jalapa tiene:         */  7 /* municipios. */,
        /* 22 - Jutiapa tiene:        */ 17 /* municipios. */
    ];

    if (depto === 0 || muni === 0) {
        return false;
    }

    if (depto > munisPorDepto.length) {
        return false;
    }

    if (muni > munisPorDepto[depto - 1]) {
        return false;
    }

    // Se verifica el correlativo con base 
    // en el algoritmo del complemento 11.
    var total = 0;

    for (var i = 0; i < numero.length; i++) {
        total += numero[i] * (i + 2);
    }

    var modulo = (total % 11);

    return modulo === verificador;
}, "Número de DPI inválido.");


jQuery.validator.addMethod("nit_rule", function (value, element, min) {
    // en el caso de los NIT que terminan en K, se convierte a mayÃºsculas
    // tambiÃ©n el NIT CF o C/F es vÃ¡lido (CF = consumidor final)
    txtN = value.toUpperCase();
    if (txtN == "CF" || txtN == "C/F") return true;
    var nit = txtN;
    var pos = nit.indexOf("-");

    if (pos < 0) {
        var correlativo = txtN.substr(0, txtN.length - 1);
        correlativo = correlativo + "-";

        var pos2 = correlativo.length - 2;
        var digito = txtN.substr(pos2 + 1);
        nit = correlativo + digito;
        pos = nit.indexOf("-");
        txtN = nit;
    }

    var Correlativo = nit.substr(0, pos);
    var DigitoVerificador = nit.substr(pos + 1);
    DigitoVerificador.toUpperCase();
    var Factor = Correlativo.length + 1;
    var Suma = 0;
    var Valor = 0;
    for (x = 0; x <= (pos - 1); x++) {
        Valor = eval(nit.substr(x, 1));
        var Multiplicacion = eval(Valor * Factor);
        Suma = eval(Suma + Multiplicacion);
        Factor = Factor - 1;
    }
    var xMOd11 = 0;
    xMOd11 = (11 - (Suma % 11)) % 11;
    var s = xMOd11;
    if ((xMOd11 == 10 && DigitoVerificador == "K") || (s == DigitoVerificador)) {
        return true;
    }
    else {
        return false;
    }
}, "Número de NIT inválido.");

/** min_number **/

jQuery.validator.addMethod("min_number_rule", function (value, element, min) {
    var result = true;

    /*    value = value.substr(3);
        value = parseFloat(value.replace(/,/g, ''));*/

    if (value < min) {
        min_money_txt = "M&iacute;nimo " + min;
        result = false;
    }
    return this.optional(element) || result;
}, get_min_money_txt);

/** min_money_rule **/

jQuery.validator.addMethod("min_money_rule", function (value, element, min) {
    var result = true;

    value = value.substr(3);
    value = parseFloat(value.replace(/,/g, ''));

    if (value < min) {
        min_money_txt = get_min_money_message(min);
        result = false;
    }
    return this.optional(element) || result;
}, get_min_money_txt);

/** max_number **/

jQuery.validator.addMethod("max_number_rule", function (value, element, max) {
    var result = true;

    /*    value = value.substr(3);
        value = parseFloat(value.replace(/,/g, ''));*/

    if (value > max) {
        max_money_length_txt = "M&aacute;ximo " + max;
        result = false;
    }
    return this.optional(element) || result;
}, get_max_money_length_txt);

/** max_money_length_rule **/

jQuery.validator.addMethod("max_money_length_rule", function (value, element, max) {
    var result = true;

    value = value.substr(3);
    value = parseFloat(value.replace(/,/g, ''));

    if (value.toString().length > max) {
        max_money_length_txt = get_max_length_message(max);

        result = false;
    }
    return this.optional(element) || result;
}, get_max_money_length_txt);

/** email_rule **/
jQuery.validator.addMethod("email_rule", function (value, element) {
    var result = true;

    if (value.length > 50) {
        email_txt = get_max_length_message(50);
        result = false;
    } else if (/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value) == false) {
        email_txt = valid_mail_message;

        result = false;
    }

    return this.optional(element) || result;
}, get_email_txt);


/** identificacion_rule **/
jQuery.validator.addMethod("identificacion_rule", function (value, element) {
    var result = true;

    if (value.length > 16) {
        result = false;
        identificacion_txt = get_max_length_message(16);
    } else if (validate_characters_identificacion(value) == false) {
        result = false;
        identificacion_txt = identificacion_only_message;
    }

    return this.optional(element) || result;
}, get_identificacion_txt);


/** centroTrabajo_rule **/
jQuery.validator.addMethod("centroTrabajo_rule", function (value, element) {
    var result = true;

    if (value.length > 100) {
        centro_de_trabajo_txt = get_max_length_message(100)
        result = false;
    }

    return this.optional(element) || result;
}, get_centro_de_trabajo_txt);


/** textonly_rule **/
jQuery.validator.addMethod("textonly_rule", function (value, element) {
    var result = true;

    if (value[value.length - 1] == " ") {
        textonly_txt = no_white_space_message;
        result = false;
    }
    else if (is_only_text(value) == false) {
        textonly_txt = onlytext_message;
        result = false;
    }
    else if ((value.length < 2)) {
        textonly_txt = get_min_length_message(2);
        result = false;
    }
    else if ((value.length >= 30)) {
        textonly_txt = get_max_length_message(30);
        result = false;
    }

    return this.optional(element) || result;
}, get_textonly_txt);


/** numberonly_rule **/
jQuery.validator.addMethod("numberonly_rule", function (value, element) {
    var result = true;

    if (value[value.length - 1] == " ") {
        numberonly_txt = no_white_space_message;
        result = false;
    }
    else if (is_only_number(value) == false) {
        result = false;
        numberonly_txt = only_numbers_message;
    }
    else if (jQuery.inArray(element.name, numberonly_max_length_10) !== -1) {
        if (value.length > 10) {
            result = false;

            numberonly_txt = get_max_length_message(10);
        }
    }

    return this.optional(element) || result;
}, get_numberonly_txt);


/** tel_rule **/
jQuery.validator.addMethod("tel_rule", function (value, element) {
    var result = true;
    if (value[value.length - 1] == " ") {
        tel_txt = no_white_space_message;
        result = false;
    } else if (is_only_number(value) == false) {
        tel_txt = only_numbers_message;
        result = false;
    } else if (value.length > 8) {
        tel_txt = get_max_length_message(8);
        result = false;
    }

    return result;
    return this.optional(element) || is_only_number(value) && (value.length == 8);
}, get_tel_txt);

/** currency_rule **/
jQuery.validator.addMethod("currency_rule", function (value, element) {
    value = value.substr(3);
    value = parseFloat(value.replace(/,/g, ''));

    var result = true;

    if (is_only_number(value) == false || isNaN(value)) {
        result = false;
        currency_txt = only_numbers_message;
    }
    else if (element.getAttribute("monto_min_dolares") != "") {

        var minimo = 0;

        if (element.className.indexOf("dolares") >= 0) {
            minimo = element.getAttribute("monto_min_dolares");
        }
        else if (element.className.indexOf("cordobas") >= 0) {
            minimo = element.getAttribute("monto_min_cordobas");
        }
        else if (element.className.indexOf("euros") >= 0) {
            minimo = element.getAttribute("monto_min_euros");
        }

        if (value < parseInt(minimo)) {
            result = false;
            currency_txt = "El monto debe ser como m&iacute;nimo " + minimo;
        }
    }

    return this.optional(element) || result;
}, get_currency_txt);


/**** ======================================================================================================== ****/
// Configuracion de validacion del formulario.
/******* =================================================================================================== ****/
var datos_validate = {
    ignore: ".ignore",
    rules: {
        "hiddenRecaptcha": {
            required: function () {
                if (grecaptcha.getResponse() == '') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        plazo: {
            required: true,
            numberonly_rule: true
        },
        numeroDPI: {
            required: true,
            dpi_rule: true
        },
        celular: {
            required: true,
            numberonly_rule: true
        },
        telefonoCelular: {
            required: true,
            numberonly_rule: true
        },
        mensaje: {
            required: true
        },
        tipoCredito: {
            required: true
        },
        tipoIngreso: {
            required: true
        },
        tipo_id: {
            required: true
        },
        departamento: {
            required: true
        },
        codproducto: {
            required: true
        },
        domicilio: {
            required: true
        },
        valorPrestamo: {
            required: true,
            currency_rule: true,
            max_money_length_rule: 10
        },
        productoASolicitar: {
            required: true,
            textonly_rule: true
        },
        nombre: {
            required: true,
            textonly_rule: true
        },
        nombreCompleto: {
            required: true,
            textonly_rule: true
        },
        primerNombre: {
            required: true,
            textonly_rule: true
        },
        segundoNombre: {
            textonly_rule: true
        },
        nombres: {
            required: true,
            textonly_rule: true
        },
        nombreReferido: {
            required: true,
            textonly_rule: true
        },
        apellido: {
            required: true,
            textonly_rule: true
        },
        primerApellido: {
            required: true,
            textonly_rule: true
        },
        segundoApellido: {
            textonly_rule: true
        },
        apellidos: {
            required: true,
            textonly_rule: true
        },
        apellidoReferido: {
            required: true,
            textonly_rule: true
        },
        identificacion: {
            required: true,
            identificacion_rule: true
        },
        email: {
            required: true,
            email_rule: true
        },
        emailReferido: {
            email_rule: true
        },
        correoElectronico: {
            email_rule: true
        },
        centroTrabajo: {
            required: true,
            centroTrabajo_rule: true
        },
        telefono: {
            required: true,
            tel_rule: true
        },
        telefonoDeContacto: {
            required: true,
            tel_rule: true
        },
        telefonoReferido: {
            required: true,
            tel_rule: true
        },
        telefonoDeTrabajo: {
            required: true,
            tel_rule: true
        },
        ingreso: {
            required: true,
            currency_rule: true,
            max_money_length_rule: 10
        },
        monto: {
            required: true,
            currency_rule: true,
            max_money_length_rule: 10
        },
        plazoDias: {
            required: true,
            numberonly_rule: true,
            min: 30
        },
        fechaInicial: {
            required: true,
            date: true
        },
        fechaNacimiento: {
            required: true,
            date: true
        },
        peridiocidad: {
            required: true
        },
        valorVivienda: {
            required: true,
            currency_rule: true
        },
        montoPrima: {
            required: true,
            currency_rule: true,
            max_money_length_rule: 10
        },
        nombreConyugue: {
            textonly_rule: true
        },
        identificacionConyugue: {
            identificacion_rule: true
        },
        egreso: {
            currency_rule: true,
            max_money_length_rule: 10
        },
        numero_id: {
            required: true,
            identificacion_rule: true
        },
        beneficiarios: {
            required: true,
            textonly_rule: true
        },
        aporte: {
            required: true
        },
        masInformacionProductos: {
            required: true
        },
        nit: {
            required: true,
            nit_rule: true
        },
        fechaNacimiento: {
            required: true
        },
        clientePromerica: {
            required: true
        },
        extranjero: {
            required: true
        },
        tipoTarjeta:{
        required: true
        },
        EmpresaDondeLabora: {
            required: true
        }
    },
    messages: {
        productoASolicitar: {
            required: required_txt
        },
        telefonoDeTrabajo: {
            required: required_txt
        },
        telefonoCelular: {
            required: required_txt
        },
        nombreCompleto: {
            required: required_txt
        },
        extranjero: {
            required: required_txt
        },
        clientePromerica: {
            required: required_txt
        },
        telefonoDeContacto: {
            required: required_txt
        },
        celular: {
            required: required_txt
        },
        numeroDPI: {
            required: required_txt
        },
        fechaNacimiento: {
            required: required_txt
        },
        nit: {
            required: required_txt
        },
        masInformacionProductos: {
            required: required_txt
        },
        valorPrestamo: {
            required: valorPrestamo_txt
        },
        beneficiarios: {
            required: required_txt
        },
        plazo: {
            required: required_txt
        },
        nombre: {
            required: required_txt
        },
        primerNombre: {
            required: required_txt
        },
        nombres: {
            required: required_txt
        },
        nombreReferido: {
            required: required_txt
        },
        apellido: {
            required: required_txt
        },
        primerApellido: {
            required: required_txt
        },
        apellidos: {
            required: required_txt
        },
        apellidoReferido: {
            required: required_txt
        },
        identificacion: {
            required: required_txt
        },
        email: {
            required: required_txt
        },
        centroTrabajo: {
            required: required_txt
        },
        telefono: {
            required: required_txt
        },
        telefonoReferido: {
            required: required_txt
        },
        ingreso: {
            required: required_txt
        },
        mensaje: {
            required: required_txt
        },
        "hiddenRecaptcha": {
            required: required_txt
        },
        codproducto: {
            required: required_txt
        },
        monto: {
            required: required_txt
        },
        plazoDias: {
            required: required_txt
        },
        fechaInicial: {
            required: required_txt,
            date: date_txt
        },
        fechaNacimiento: {
            required: required_txt,
            date: date_txt
        },
        peridiocidad: {
            required: required_txt
        },
        valorVivienda: {
            required: required_txt,
            max_money_length_rule: 10
        },
        montoPrima: {
            required: required_txt
        },
        tipoCredito: {
            required: required_txt
        },
        tipoIngreso: {
            required: required_txt
        },
        tipo_id: {
            required: required_txt
        },
        departamento: {
            required: required_txt
        },
        numero_id: {
            required: required_txt
        },
        domicilio: {
            required: required_txt
        },
        aporte: {
            required: required_txt
        },
        tipoTarjeta: {
            required: required_txt
        },
        EmpresaDondeLabora: {
            required: required_txt
        }
    }
}

if ($('#frmGeneric').length > 0) {
    var btn = $('#btnGenericFrm');

    if ($(".currency") != null) { set_onfocus_campos_currency(); }


    $(".validate").submit(function (e) {
        e.preventDefault();
    }).validate({
        ignore: ".ignore",
        rules: datos_validate["rules"],
        messages: datos_validate["messages"],
        submitHandler: function (form) {
            frm = $(form);
            if (frm.hasClass('frmString')) {
                var captcha = $('.g-recaptcha');
                if (captcha.length > 0) {
                    haveCaptcha = true;
                    var urlCaptcha = captcha.attr('data-url');

                    var captchaJson = {
                        response: $('#g-recaptcha-response').val()
                    }

                    getJson(urlCaptcha, JSON.stringify(captchaJson), 0, false);
                }
            }

            if (haveCaptcha === false || captchaIsValid === true) {
                $('.calc_hide').fadeOut(0);
                $('.calc_preload').fadeIn('fast');

                var requestJson = JSON.stringify(frm.serializeObject());
                var url = btn.attr('data-url');

                getJson(url, requestJson, 1, true);
            }

            return true;
        }
    });

    $.fn.datepicker.dates['es'] = {
        days: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sat", "Dom"],
        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    };

    $("#datepicker").datepicker({
        dateFormat: 'dd/mm/yyyy',
        language: 'es'
    });
}

//if ($('#tipoCambio').length > 0) {
//    tipoCambio = $('#tipoCambio');

//    var url = tipoCambio.attr('data-url');
//    getJson(url, '', 2, true);
//}

if ($('#tipoCambioHomeAgencia').length > 0 && $('#tipoCambioHomeBanca').length > 0) {
    //Agencia
    var tipoCambioAgenciaContainer = $('#tipoCambioHomeAgencia');
    var cambioAgencia = $('#tipoCambioHomeAgencia').find('.cambio');

    //Banca en Línea
    var tipoCambioBancaContainer = $('#tipoCambioHomeBanca');
    var cambioBanca = $('#tipoCambioHomeBanca').find('.cambio');

    var dolarCompra = "0.00";
    var dolarVenta = "0.00";
    var euroCompra = "0.00";
    var euroVenta = "0.00";

    $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: "https://wstasacambio.bancopromerica.com.gt/wsonlineservicebus.asmx/getTipoCambio",
        data: "{}",
        dataType: "json",
        async: false,
        success: function (msg) {
            cambioAgencia.html('Compra <span>' + parseFloat(msg.d.compraAgencia).toFixed(2) + '</span> <span id="separator_line">|</span>Venta <span>' + parseFloat(msg.d.ventaAgencia).toFixed(2) + '</span>');
            cambioBanca.html('Compra <span>' + parseFloat(msg.d.compraInternet).toFixed(2) + '</span> <span id="separator_line">|</span>Venta <span>' + parseFloat(msg.d.ventaInternet).toFixed(2) + '</span>');
        }
        , error: function (textStatus, errorThrown, errorDetail) {
            cambioAgencia.html('Compra <span>' + parseFloat(dolarCompra).toFixed(2) + '</span> <span id="separator_line">|</span>Venta <span>' + parseFloat(dolarVenta).toFixed(2) + '</span>');
            cambioBanca.html('Compra <span>' + parseFloat(dolarCompra).toFixed(2) + '</span> <span id="separator_line">|</span>Venta <span>' + parseFloat(dolarVenta).toFixed(2) + '</span>');
        }
    });

    //$('.tipoDolar')
    //    .click(function () {
    //        cambio.html('Compra <span>' + parseFloat(dolarCompra).toFixed(2) + '</span> <span id="separator_line">|</span>Venta <span>' + parseFloat(dolarVenta).toFixed(2) + '</span>');
    //    });

    //$('.tipoEuro')
    //    .click(function () {
    //        cambio.html('Compra <span>' + parseFloat(euroCompra).toFixed(2) + '</span> <span id="separator_line">|</span>Venta <span>' + parseFloat(euroVenta).toFixed(2) + '</span>');
    //    });
}

if ($('#codproducto').length > 0) {
    $('#codproducto')
        .change(function () {
            var value = $(this).val();

            var containerSinRev = $('.hide_sin_rev');
            var containerRev = $('.hide_rev');

            switch (value) {
                case '60':
                    containerRev.removeClass('hide');
                    containerSinRev.addClass('hide');
                    break;
                case '61':
                    containerRev.addClass('hide');
                    containerSinRev.removeClass('hide');
                    break;
                case '62':
                    containerRev.addClass('hide');
                    containerSinRev.removeClass('hide');
                    break;
            }
        });
}

function getCaptchaErrorMessage(error_code) {
    var errorMsj = '';

    switch (error_code) {
        case 'missing-input-secret':
            errorMsj = 'La clave secreta es requerida';
            break;
        case 'invalid-input-secret':
            errorMsj = 'La clave secreta es inv&aacute;lida o incorrecta';
            break;
        case 'missing-input-response':
            errorMsj = 'El captcha es requerido';
            break;
        case 'invalid-input-response':
            errorMsj = 'El captcha es inv&aacute;lido o incorrecto';
            break;
    }

    return errorMsj;
}

function setError(value) {
    $('.calc_preload').fadeOut('fast', function () {
        var errorDiv = $('#errorMsj');
        errorDiv.removeClass('hide');

        var errorMsj = errorDiv.find('p');
        errorMsj.html('<strong>Error en el formulario: </strong>' + value);
    });
}

$('#plazo').append('<option value="">Seleccione una opción</option>');

$('#tipo')
    .change(function () {
        var plazo = $('#plazo');
        plazo.find('option').remove();

        var values = [];
        switch ($(this).val()) {
            case '1':
                values = [12, 24, 36];
                break;
            case '2':
                values = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180];
                break;
            case '3':
                values = [12, 24, 36, 48];
                break;
            default:
        }

        fillSelect(plazo, values);
    });

function fillSelect(input, data) {
    var firstTime = true;
    for (var i = 0; i < data.length; i++) {
        if (firstTime) {
            input.append('<option value="">Seleccione una opción</option>');
        }

        input.append('<option value=' + data[i] + '>' + data[i] + '</option>');
        firstTime = false;
    }
}

function fill(htmlElement, data) {
    if (htmlElement.is('input')) {
        htmlElement.val(data);
    } else {
        var firstTime = true;
        $.each(data,
            function (key, value) {
                if (firstTime) {
                    htmlElement.append('<option value="">Seleccione una opción<option>');
                }
                htmlElement.append('<option value=' + key + '>' + value + '<option>');

                firstTime = false;
            });
    }
}

function set_onfocus_campos_currency() {
    if ($(".currency").length > 0) {
        for (var i = 0; i < $(".currency").length; i++) {
            if ($(".currency")[i].readOnly != true) {
                $(".currency")[i].addEventListener("focus", function () { this.value = "" });
            }
        }
    }
}

function getJson(url, args, op, async) {
    var jsonParam = {}
    if (args.length > 0) {
        jsonParam = {
            json: args
        }
    }

    $.ajax({
        type: 'GET',
        url: url,
        data: jsonParam,
        async: async,
        success: function (response) {
            responseJson = response;

            if (async) {
                switch (op) {
                    case 1:
                        if (frm.hasClass('frmString')) {
                            if (responseJson.value === '000') {
                                $('.calc_preload').fadeOut('fast', function () {
                                    $('.calc_content').fadeIn('fast');
                                });
                            } else {
                                if (responseJson.error)
                                    setError(responseJson.value);
                            }
                        } else {
                            if (responseJson.length > 0) {
                                setData(frm, responseJson);
                                $('.calc_preload').fadeOut('fast', function () {
                                    $('.calc_content').fadeIn('fast');
                                });
                            } else {
                                setError('Ocurrio un error al procesar la solicitud');
                            }
                        }
                        break;
                    case 2:
                        fill(tipoCambio, JSON.parse(responseJson).TipoCambio);
                        break;
                }
            } else {
                var captchaResponseJson = JSON.parse(responseJson);
                if (captchaResponseJson.success) {
                    captchaIsValid = true;
                } else {
                    var messageError = getCaptchaErrorMessage(captchaResponseJson['error-codes'][0]);
                    setError(messageError);
                }
            }
        }
    });
}

function setData(frm, json) {
    var inputs = frm.find('input[readonly]');
    $.each(JSON.parse(json),
        function (id, value) {
            console.log("aca muere");
            [].forEach.call(inputs,
                function (input) {
                    if (input.name === id) {
                        $(input).val(value).trigger('blur');

                        if ($(input).hasClass('porcentaje')) {
                            $(input).val(value + ' %');
                        }
                    }
                });
        });
}

function getNumber(value) {
    var number = value.replace(/[^\d\.-]*/g, '');

    if (!$.isNumeric(number)) {
        return value;
    }

    number = parseFloat(number).toFixed(2);
    return number.toLocaleString();
}

$.fn.serializeObject = function () {
    var o = {};
    var frm = this;
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }

            if (!frm.hasClass('frmString'))
                o[this.name].push(getNumber(this.value) || '');
            else
                o[this.name].push(this.value || '');

        } else {

            if (!frm.hasClass('frmString'))
                o[this.name] = getNumber(this.value) || '';
            else
                o[this.name] = this.value || '';

        }
    });

    return o;
};

function mostrar_casa_comercial() {
    if ($("#tipoCredito option:selected").text() == "Crédito de Vehículo") {
        $("#marca").parent().parent().show();
    }
    else {
        $("#marca").parent().parent().hide();
        $('#marca').val('');
    }
}