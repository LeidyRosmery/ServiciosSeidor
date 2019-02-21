var nameSpaceFile = "Test";
var textAccess = $.import("sap.hana.xs.i18n", "text");
var bundle = textAccess.loadBundle(nameSpaceFile + ".I18n", "messaje");
var config = textAccess.loadBundle(nameSpaceFile + ".Config", "config");
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function utf8_encode(string) {
	string = string.replace(/\r\n/g, "\n");
	var utftext = "";
	for (var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);
		if (c < 128) {
			utftext += String.fromCharCode(c);
		} else if ((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}
	}
	return utftext;
}

function utf8_encodeVacaciones(argString) {
	if (argString === null || argString === 'undefined') {
		return '';
	}
	var string = argString + '""';
	var utftext = '';
	var start;
	var end;
	var stringl = 0;
	var n = 0;
	var c1;
	var enc;
	var c2;
	start = end = 0;
	stringl = string.length;
	for (n = 0; n < stringl; n++) {
		c1 = string.charCodeAt(n);
		enc = null;
		if (c1 < 128) {
			end++;
		} else if (c1 > 127 && c1 < 2048) {
			enc = String.fromCharCode(
				(c1 >> 6) | 192, (c1 & 63) | 128
			);
		} else if ((c1 & 0xF800) !== 0xD800) {
			enc = String.fromCharCode(
				(c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
		} else {
			if ((c1 & 0xFC00) !== 0xD800) {
				throw new RangeError('Unmatched trail surrogate at ' + n);
			}
			c2 = string.charCodeAt(++n);
			if ((c2 & 0xFC00) !== 0xDC00) {
				throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
			}
			c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
			enc = String.fromCharCode(
				(c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
		}
		if (enc !== null) {
			if (end > start) {
				utftext += string.slice(start, end);
			}
			utftext += enc;
			start = end = n + 1;
		}
	}
	if (end > start) {
		utftext += string.slice(start, stringl);
	}
	return utftext;
}

function utf8_decodeVacaciones(strData) {
	var tmpArr = [];
	var i = 0;
	var c1 = 0;
	var seqlen = 0;
	var ai;
	strData += '';
	while (i < strData.length) {
		c1 = strData.charCodeAt(i) & 0xFF;
		seqlen = 0;
		if (c1 <= 0xBF) {
			c1 = (c1 & 0x7F);
			seqlen = 1;
		} else if (c1 <= 0xDF) {
			c1 = (c1 & 0x1F);
			seqlen = 2;
		} else if (c1 <= 0xEF) {
			c1 = (c1 & 0x0F);
			seqlen = 3;
		} else {
			c1 = (c1 & 0x07);
			seqlen = 4;
		}
		ai = 0;
		for (ai = 1; ai < seqlen; ++ai) {
			c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F));
		}
		if (seqlen === 4) {
			c1 -= 0x10000;
			tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)));
			tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)));
		} else {
			tmpArr.push(String.fromCharCode(c1));
		}
		i += seqlen;
	}
	return tmpArr.join('');
}

function utf8_decode(utftext) {
	var string = "";
	var i = 0;
	var c = 0;
	var c1 = 0;
	var c2 = 0;
	var c3 = 0;

	while (i < utftext.length) {

		c = utftext.charCodeAt(i);

		if (c < 128) {
			string += String.fromCharCode(c);
			i++;
		} else if ((c > 191) && (c < 224)) {
			c2 = utftext.charCodeAt(i + 1);
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		} else {
			c2 = utftext.charCodeAt(i + 1);
			c3 = utftext.charCodeAt(i + 2);
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}

	}

	return string;
}

function encode(input) {
	var output = "";
	var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	var i = 0;

	input = utf8_encode(input);

	while (i < input.length) {

		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output = output +
			this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) +
			this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4);

	}

	return output;
}

function decode(input) {
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;
	input = input.substr(4, input.length);
	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	while (i < input.length) {

		enc1 = this.keyStr.indexOf(input.charAt(i++));
		enc2 = this.keyStr.indexOf(input.charAt(i++));
		enc3 = this.keyStr.indexOf(input.charAt(i++));
		enc4 = this.keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output = output + String.fromCharCode(chr1);

		if (enc3 != 64) {
			output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output = output + String.fromCharCode(chr3);
		}

	}

	output = utf8_decode(output);

	return output;
}

/**
 * @description Función crear un objeto oResponse para las respuestas correctas de los servicios xsjs
 * @creation David Villanueva 17/01/2018
 * @update
 */
function sendResponse(sIdTransaccion, iCode, sMessage, oData) {
	var oResponse = {};
	oResponse.oAuditResponse = {};
	oResponse.oAuditResponse.sIdTransaction = sIdTransaccion;
	oResponse.oAuditResponse.iCode = iCode;
	oResponse.oAuditResponse.sMessage = sMessage;
	//oResponse.oAuditResponse.oData = oData;

	oResponse.oResults = oData;
	$.response.status = $.net.http.OK;
	$.response.contentType = 'application/json';
	$.response.setBody(JSON.stringify(oResponse));
}

function sendData(data) {
	$.response.status = $.net.http.OK;
	$.response.contentType = 'application/json';
	$.response.setBody(JSON.stringify(data));
}

/**
 * @description Función crear un objeto oResponse para las respuestas con error de los servicios xsjs
 * @creation David Villanueva 17/01/2018
 * @update
 */
function sendResponseError(sIdTransaccion, iCode, sMessage) {
	var oResponse = {};
	oResponse.oAuditResponse = {};
	oResponse.oAuditResponse.sIdTransaction = sIdTransaccion;
	oResponse.oAuditResponse.iCode = iCode;
	oResponse.oAuditResponse.sMessage = sMessage;

	$.response.status = $.net.http.OK;
	$.response.contentType = 'application/json';
	$.response.setBody(JSON.stringify(oResponse));
}

/**
 * @description Función crear un objeto de Auditoria
 * @creation David Villanueva 26/07/2018
 * @update
 */
function datosAuditoria(headers) {
	var oAuditoriaRequest = {};
	oAuditoriaRequest.sIdTransaccion = headers.get("sIdTransaccion");
	oAuditoriaRequest.sTerminal = headers.get("X-FORWARDED-FOR") + ' ';
	oAuditoriaRequest.sUsuario = utils.decode(headers.get("sToken"));
	oAuditoriaRequest.sAplicacion = headers.get("sAplicacion");
	oAuditoriaRequest.dFecha = new Date();

	return oAuditoriaRequest;
}

/**
 * @description Función para validar los parametros de request para los metodos post
 * @creation David Villanueva 27/07/2018
 * @update
 */
function validarAuditRequest(contentType, bodyStr) {
	var oResponse = {};
	try {
		if (contentType === null || contentType.startsWith("application/json") === false) {
			oResponse.iCode = parseInt(bundle.getText("code.idf5"), 10);
			oResponse.sMessage = bundle.getText("msj.idf5");
			return oResponse;
		}
		var bodyStrNew = bodyStr ? bodyStr.asString() : undefined;
		if (bodyStrNew === undefined) {
			oResponse.iCode = parseInt(bundle.getText("code.idf6"), 10);
			oResponse.sMessage = bundle.getText("msj.idf6");
			return oResponse;
		}
		var bodyJson = JSON.parse(bodyStrNew);
		if (bodyJson.oAuditRequest === undefined || bodyJson.oAuditRequest === '') {
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4", ["Falta el objeto de Auditoria"]);
			return oResponse;
		}
		if (bodyJson.oAuditRequest.sIdTransaccion === undefined || bodyJson.oAuditRequest.sIdTransaccion === '') {
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4", ["idTransaccion"]);
			return oResponse;
		}
		if (bodyJson.oAuditRequest.sAplicacion === undefined || bodyJson.oAuditRequest.sAplicacion === '') {
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4", ["aplicacion"]);
			return oResponse;
		}
		if (bodyJson.oAuditRequest.sUsuario === undefined || bodyJson.oAuditRequest.sUsuario === '') {
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4", ["usuario"]);
			return oResponse;
		}
		if (bodyJson.oAuditRequest.dFecha === undefined || bodyJson.oAuditRequest.dFecha === '') {
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4", ["fecha"]);
			return oResponse;
		}
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		return oResponse;

	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt4"), 10);
		oResponse.sMessage = bundle.getText("msj.idt4", [e.toString()]);
		return oResponse;
	}
}

function validarPostRequest(contentType, bodyStr, headers) {
	var oResponse = {};
	try {
		if (contentType === null || contentType.startsWith("application/json") === false) {
			oResponse.iCode = parseInt(bundle.getText("code.idf5"), 10);
			oResponse.sMessage = bundle.getText("msj.idf5");
			return oResponse;
		}

		if (headers.get('sToken') === undefined || headers.get('sToken') === null) {
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4");
			return oResponse;
		}

		if (headers.get('sAplicacion') === undefined || headers.get('sAplicacion') === null) {
			oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
			oResponse.sMessage = bundle.getText("msj.idf10", ["aplicacion"]);
			return oResponse;
		}

		if (headers.get('sIdTransaccion') === undefined || headers.get('sIdTransaccion') === null) {
			oResponse.iCode = parseInt(bundle.getText("code.idf12"), 10);
			oResponse.sMessage = bundle.getText("msj.idf12");
			return oResponse;
		}

		var bodyStrNew = bodyStr ? bodyStr.asString() : undefined;
		if (bodyStrNew === undefined) {
			oResponse.iCode = parseInt(bundle.getText("code.idf6"), 10);
			oResponse.sMessage = bundle.getText("msj.idf6");
			return oResponse;
		}

		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		return oResponse;

	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt4"), 10);
		oResponse.sMessage = bundle.getText("msj.idt4", [e.toString()]);
		return oResponse;
	}
}

/**
 * @description Función para validar los parametros de request para los metodos post
 * @creation David Villanueva 27/07/2018
 * @update
 */
function validarGetRequest(contentType, headers) {
	var oResponse = {};
	try {
		//		if ( contentType === null || contentType.startsWith("application/json") === false){
		//			oResponse.iCode = parseInt(bundle.getText("code.idf5"), 10);
		//			oResponse.sMessage = bundle.getText("msj.idf5");
		//			return oResponse;
		//		}

		if (headers.get('sToken') === undefined || headers.get('sToken') === null) {
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4");
			return oResponse;
		}

		if (headers.get('sAplicacion') === undefined || headers.get('sAplicacion') === null) {
			oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
			oResponse.sMessage = bundle.getText("msj.idf10", ["aplicacion"]);
			return oResponse;
		}

		if (headers.get('sIdTransaccion') === undefined || headers.get('sIdTransaccion') === null) {
			oResponse.iCode = parseInt(bundle.getText("code.idf12"), 10);
			oResponse.sMessage = bundle.getText("msj.idf12");
			return oResponse;
		}

		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		return oResponse;

	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt4"), 10);
		oResponse.sMessage = bundle.getText("msj.idt4", [e.toString()]);
		return oResponse;
	}
}

/**
 * @description Función para convertir valores vacios en 1
 * @creation David Villanueva 18/01/2018
 * @update
 */
function convertEmptyToOne(value) {
	if (isNaN(value)) {
		value = 1;
	}
	return value;
}

/**
 * @description Función para convertir valores vacios en 0
 * @creation David Villanueva 18/01/2018
 * @update
 */
function convertEmptyToZero(value) {
	if (isNaN(value)) {
		value = 0;
	}

	return value;
}

/**
 * @description Función para convertir valores undefined a vacios
 * @creation David Villanueva 13/02/2018
 * @update
 */
function convertEmptyToVacio(value) {
	if (!value) {
		value = '';
	}
	return value;
}

/**
 * @description Función para convertir valores undefined y null a vacios
 * @creation David Villanueva 11/06/2018
 * @update
 */
function convertEmptyNullToVacio(value) {
	if (!value) {
		value = '';
	}

	if (value === null) {
		value = '';
	}
	return value;
}

var Logging = function() {
	this.startTimer = function() {
		this.start = new Date().getTime();
	};

	this.stopTimer = function() {
		return (new Date().getTime()) - this.start;
	};
};

/**
 * @description Función para retardar el servicio
 * @creation David Villanueva 01/02/2018
 * @update
 */
function wait(ms) {
	var start = new Date().getTime();
	var end = start;
	while (end < start + ms) {
		end = new Date().getTime();
	}
}

/**
 * @description Función para buscar el valor de un tag en xml
 * @creation David Villanueva 06/02/2018
 * @update
 */
function getValue(tag, xmlString) {
	var value;
	var tempString;
	var startTag, endTag;
	var startPos, endPos;
	startTag = "<" + tag + ">";
	endTag = "</" + tag + ">";
	tempString = xmlString;
	startPos = tempString.search(startTag) + startTag.length;
	endPos = tempString.search(endTag);
	value = tempString.slice(startPos, endPos);
	return value;
}

/**
 * @description Función para convertir String a fecha
 * @creation David Villanueva 06/02/2018
 * @update
 */
function convertStringtoDate1(sDate) {

	var fechaNew = sDate.substring(0, 4) + "/";
	fechaNew = fechaNew + sDate.substring(4, 6) + "/";
	fechaNew = fechaNew + sDate.substring(6, 8);

	return new Date(fechaNew);
}

/**
 * @description Función para obtener formato de fecha segun formato: dd/mm/yyyy ---- dd/mm/yyyy h:m:s
 * @creation David Villanueva 08/02/2018
 * @update
 */
function formatDate(date, format) {

	var nuevoFormat = '';
	if (date !== undefined && date !== null) {
		if (date.getFullYear() !== -1) {
			var dd = (date.getDate() <= 9 ? '0' + date.getDate() : date.getDate());
			var mm = (date.getMonth() + 1 <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
			var yyyy = date.getFullYear();
			var hour = (date.getHours() <= 9 ? '0' + date.getHours() : date.getHours());
			var minut = (date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes());
			var segund = (date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds());
			nuevoFormat = format.replace('dd', dd)
				.replace('mm', mm)
				.replace('yyyy', yyyy)
				.replace('h', hour)
				.replace('m', minut)
				.replace('s', segund);
		}
	}
	return nuevoFormat;
}

function dateHoursZero(sDate) {
	sDate.setHours(0);
	sDate.setMinutes(0);
	sDate.setSeconds(0);
	sDate.setMilliseconds(0);
	return sDate;
}
/**
 * @description Función para obtener un Id unico
 * @creation David Villanueva 08/02/2018
 * @update
 */
function generarIdTransaccion() {
	var fecha = new Date();
	var fechaIso = fecha.toISOString();
	var fechaString = fechaIso.toString().replace(/:/g, "").replace(/-/g, "").replace(".", "").replace("Z", "").replace("T", "");
	var randon = Math.floor((Math.random() * 1000000) + 1);
	var idTransaccion = fechaString + randon;
	return idTransaccion;
}

/**
 * @description Función para obtener una fecha Iso
 * @creation David Villanueva 08/02/2018
 * @update
 */
function obtenerFechaIso() {
	var d = new Date();
	var fechaIso = d.toISOString();
	return fechaIso.toString();
}

/**
 * @description Función para transformar xml a json
 * @creation David Villanueva 14/02/2018
 * @update
 */
function xml2Object(xml) {
	var parser = new $.util.SAXParser();
	var result = {};
	var lastPropertyName = '';
	parser.startElementHandler = function(name, attrs) {
		lastPropertyName = name;

		if (name === 'root') {
			return;
		}

		result[name] = '';
	};
	parser.characterDataHandler = function(value) {
		result[lastPropertyName] = value;
	};
	parser.parse(xml);
	return result;
}

/**
 * @description Función para cortar palabras
 * @creation David Villanueva 13/02/2018
 * @update
 */
function cortarPalabras(value, numero) {

	if (value.length > numero) {
		value = value.substr(0, numero);
	}

	return value;
}

/**
 * @description Función para validar si existe el numero y es mayor a 0
 * @creation David Villanueva 26/04/2018
 * @update
 */
function existeNumero(value) {

	if (value !== undefined &&
		value !== null &&
		value !== '' &&
		value > 0) {
		return true;
	}
	return false;
}

/**
 * @description Función para validar si existe el string
 * @creation David Villanueva 26/04/2018
 * @update
 */
function existeString(value) {

	if (value !== undefined &&
		value !== null &&
		value !== '') {
		return true;
	}
	return false;
}

/**
 * @description Función para convertir string a base64
 * @creation David Villanueva 26/02/2018
 * @update
 */
function Base64Encode(str) {
	if (/([^\u0000-\u00ff])/.test(str)) throw Error('String must be ASCII');

	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, bits, h1, h2, h3, h4, e = [],
		pad = '',
		c;

	c = str.length % 3; // pad string to length of multiple of 3
	if (c > 0) {
		while (c++ < 3) {
			pad += '=';
			str += '\0';
		}
	}
	// note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars

	for (c = 0; c < str.length; c += 3) { // pack three octets into four hexets
		o1 = str.charCodeAt(c);
		o2 = str.charCodeAt(c + 1);
		o3 = str.charCodeAt(c + 2);

		bits = o1 << 16 | o2 << 8 | o3;

		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;

		// use hextets to index into code string
		e[c / 3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	}
	str = e.join(''); // use Array.join() for better performance than repeated string appends

	// replace 'A's from padded nulls with '='s
	str = str.slice(0, str.length - pad.length) + pad;

	return str;
}

/**
 * @description Función para convertir  base64 a string
 * @creation David Villanueva 26/02/2018
 * @update
 */
function Base64Decode(str) {
	if (!(/^[a-z0-9+/]+={0,2}$/i.test(str)) || str.length % 4 != 0) throw Error('Not base64 string');

	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, d = [];

	for (var c = 0; c < str.length; c += 4) { // unpack four hexets into three octets
		h1 = b64.indexOf(str.charAt(c));
		h2 = b64.indexOf(str.charAt(c + 1));
		h3 = b64.indexOf(str.charAt(c + 2));
		h4 = b64.indexOf(str.charAt(c + 3));

		bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

		o1 = bits >>> 16 & 0xff;
		o2 = bits >>> 8 & 0xff;
		o3 = bits & 0xff;

		d[c / 4] = String.fromCharCode(o1, o2, o3);
		// check for padding
		if (h4 == 0x40) d[c / 4] = String.fromCharCode(o1, o2);
		if (h3 == 0x40) d[c / 4] = String.fromCharCode(o1);
	}
	str = d.join(''); // use Array.join() for better performance than repeated string appends

	return str;
}

/**
 * @description Función para cortar  palabras
 * @creation David Villanueva 04/04/2018
 * @update
 */
function cortarString(campo, num) {

	return campo.substring(campo.length - num, campo.length);

}

//++Reporte++//
function GetIdUsuario(IdScp) {
	var esquema = config.getText("CRUZDELSUR_SEGURIDAD_QAS");
	var conn = $.db.getConnection();
	var rs = '';
	//var query = 'SELECT * FROM '+esquema+'."VUsuario" AS "VU" WHERE "VU"."IdScp"=?';
	var query = 'SELECT * FROM ' + esquema + '."VUsuario" AS "VU" WHERE "VU"."IdHana"=?';
	var pstmt = conn.prepareStatement(query);
	pstmt.setString(1, IdScp);
	rs = pstmt.executeQuery();
	var IdUsuario = 0;
	var CodigoArea = "";

	if (rs.next()) {
		IdUsuario = rs.getInteger(1);
		CodigoArea = rs.getString(28); //rs.getString(13);
	}

	pstmt.close();
	return [IdUsuario, CodigoArea];

}

function GetIdUsuario4User(IdScp) {
	var esquema = config.getText("CRUZDELSUR_SEGURIDAD_QAS");
	var conn = $.db.getConnection();
	var rs = '';
	//var query = 'SELECT * FROM '+esquema+'."VUsuario" AS "VU" WHERE "VU"."IdScp"=?';
	var query = 'SELECT "Id","CodigoArea","PasswordSAP" FROM ' + esquema + '."VUsuario" AS "VU" WHERE "VU"."Usuario"=? AND "VU"."IdEstado" = ?';
	var pstmt = conn.prepareStatement(query);
	pstmt.setString(1, IdScp);
	pstmt.setInteger(2, 23);
	rs = pstmt.executeQuery();
	var IdUsuario = 0;
	var CodigoArea = "";
    var passWordSAP = "";
	if (rs.next()) {
		IdUsuario = rs.getInteger(1);
		CodigoArea = rs.getString(2); //rs.getString(13);
		passWordSAP = rs.getString(3);
	}

	pstmt.close();
	return [IdUsuario, CodigoArea, passWordSAP];

}

function GetIdUsuario4User2(usuario) {
	var esquema = config.getText("CRUZDELSUR_SEGURIDAD_PRD");
	var conn = $.db.getConnection();
	var rs = '';
	//var query = 'SELECT * FROM '+esquema+'."VUsuario" AS "VU" WHERE "VU"."IdScp"=?';
	var query = 'SELECT "Id","CodigoArea","PasswordSAP" FROM ' + esquema + '."VUsuario" AS "VU" WHERE "VU"."Usuario"=? AND "VU"."IdEstado" = ?';
	var pstmt = conn.prepareStatement(query);
	pstmt.setString(1, usuario);
	pstmt.setInteger(2, 23);
	rs = pstmt.executeQuery();
	var IdUsuario = 0;
	var CodigoArea = "";
	var Nombre ="";
    var passWordSAP = "";
	if (rs.next()) {
		IdUsuario = rs.getInteger(1);
		CodigoArea = rs.getString(2);
		passWordSAP = rs.getString(3);
	}

	pstmt.close();
	return [IdUsuario, CodigoArea, passWordSAP];

}

function GetJefes(IdUsuario) {
	var esquema = config.getText("CRUZDELSUR_SEGURIDAD_QAS");
	var conn = $.db.getConnection();
	var i = 0;
	var id_jefes = [IdUsuario];
	var query_jefes = "";
	var pstmtTop2 = "";
	var rs_jefes = "";
	for (i = 0; i < id_jefes.length; i++) {
		query_jefes = 'SELECT "Id" FROM ' + esquema + '."Usuario" WHERE "IdEstado"=23 AND "IdPadre"=?';
		pstmtTop2 = conn.prepareStatement(query_jefes);
		pstmtTop2.setInteger(1, id_jefes[i]);
		rs_jefes = pstmtTop2.executeQuery();
		while (rs_jefes.next()) {
			id_jefes.push(rs_jefes.getInteger(1));
		}
		pstmtTop2.close();
	}
	conn.commit();
	return id_jefes;

}

function GetJefes2(IdUsuario) {
	var esquema = config.getText("CRUZDELSUR_SEGURIDAD_QAS");
	var conn = $.db.getConnection();
	var i = 0;
	var id_jefes = [];
	var query_jefes = "";
	var pstmtTop2 = "";
	var rs_jefes = "";

	query_jefes = 'SELECT "Id" FROM ' + esquema + '."Usuario" WHERE "IdEstado"=23 AND "IdPadre"=?';
	pstmtTop2 = conn.prepareStatement(query_jefes);
	pstmtTop2.setInteger(1, IdUsuario);
	rs_jefes = pstmtTop2.executeQuery();
	while (rs_jefes.next()) {
		id_jefes.push(rs_jefes.getInteger(1));
	}

	return id_jefes;

}

function GetJefesNombre(IdUsuario) {
	var esquema = config.getText("CRUZDELSUR_SEGURIDAD_QAS");
	var conn = $.db.getConnection();
	var i = 0;
	var id_jefes = [IdUsuario];
	var query_jefes = "";
	var pstmtTop2 = "";
	var rs_jefes = "";
	var Nombre = "";
	var Apellido = "";
	query_jefes = 'SELECT "Nombre", "Apellido" FROM ' + esquema + '."Usuario" WHERE "IdEstado"=23 AND "Id"=?';
	pstmtTop2 = conn.prepareStatement(query_jefes);
	pstmtTop2.setInteger(1, id_jefes[i]);
	rs_jefes = pstmtTop2.executeQuery();
	if (rs_jefes.next()) {
		Nombre = rs_jefes.getString(1);
		Apellido = rs_jefes.getString(2); //rs.getString(13);
	}

	pstmtTop2.close();
	return [Nombre, Apellido];

}

function mapCallbackIdUsuario(Obj) {
	return Obj.IdUsuario;
}

function validarPostRequestPrueba() {
	var contentType = $.request.contentType;
	var bodyStr;
	try {
		bodyStr = JSON.parse($.request.body.asString())
	} catch (e) {}
	var headers = $.request.headers;
	var accion = $.request.parameters.get('Accion');

	var method = $.request.method;
	var POST = $.net.http.POST;
	var GET = $.net.http.GET;
	var PUT = $.net.http.PUT;
	var DELETE = $.net.http.DELETE;

	//InicioPara Debugg
	contentType = "application/json";
	headers = {
		sIdTransaccion: "dd",
		sToken: "AzsFZnJhbnpwbHQ5MQ==",
		sAplicacion: "dd"
	};
	bodyStr = {
		"oResults": {
			"Action": "GetJefes",
			"sIdScp": "P000002"
		}
	};
	accion = "GetJefes";

	var paramIn = {};
	paramIn.body = bodyStr;
	paramIn.headers = headers;
	paramIn.accion = accion;
	paramIn.method = POST; //method
	paramIn.POST = POST;
	paramIn.GET = GET;
	paramIn.PUT = PUT;
	paramIn.DELETE = DELETE;

	//End Para Debugg
	var oResponse = {};
	try {
		if (contentType === null || contentType.startsWith("application/json") === false) {
			oResponse.iCode = parseInt(bundle.getText("code.idf5"), 10);
			oResponse.sMessage = bundle.getText("msj.idf5");
			//return oResponse;
		}

		/*if ( headers.get('sToken') === undefined || headers.get('sToken') === null){
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4");
			return oResponse;
		}
		
		if ( headers.get('sAplicacion') === undefined || headers.get('sAplicacion') === null){
			oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
			oResponse.sMessage = bundle.getText("msj.idf10",["aplicacion"]);
			return oResponse;
		}
		
		if ( headers.get('sIdTransaccion') === undefined || headers.get('sIdTransaccion') === null){
			oResponse.iCode = parseInt(bundle.getText("code.idf12"), 10);
			oResponse.sMessage = bundle.getText("msj.idf12");
			return oResponse;
		}*/

		var bodyStrNew = bodyStr; // ? bodyStr.asString() : undefined;
		if (bodyStrNew === undefined) {
			oResponse.iCode = parseInt(bundle.getText("code.idf6"), 10);
			oResponse.sMessage = bundle.getText("msj.idf6");
			return oResponse;
		}

		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		oResponse.paramIn = paramIn;
		return oResponse;

	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt4"), 10);
		oResponse.sMessage = bundle.getText("msj.idt4", [e.toString()]);
		return oResponse;
	}
}

function xmlToJSON(xml, settings) {
	var parser = new $.util.SAXParser();
	var result = {};
	var lastName = '';
	var lastSetting = null;
	var lastElement = null;
	var numItem = [];
	var lsObject = [];
	parser.startElementHandler = function(name, attrs) {
		lastName = name;

		lastSetting = settings[lastName];
		if (lastSetting) {
			lastName = lastSetting.mask ? lastSetting.mask : lastName;
		}

		if (!lastSetting || (lastSetting.consider === false && lastSetting.type === 'object')) {
			return;
		}

		if (lastElement === null) {
			lastElement = result;
		}

		if (lastSetting.type === 'object') {
			lsObject.push(lastName);
			lastElement[lsObject[lsObject.length - 1]] = {};
			numItem = [];
		}

		if (lastName === "item") {
			numItem.push(lastName);
			if (numItem.length < 2) {
				lastElement[lsObject[lsObject.length - 1]][lastName] = [];
				lastElement[lsObject[lsObject.length - 1]][lastName].push({});
			} else {
				lastElement[lsObject[lsObject.length - 1]][lastName].push({});
			}
		}

	};

	parser.characterDataHandler = function(value) {
		//mostramos solomente los de tipo property
		if (lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.consider === true) {
			lastElement[lsObject[lsObject.length - 1]]["item"][numItem.length - 1][lastSetting.mask] = (value === "null" ? null : value);
		}

	};
	parser.parse(xml);

	return result;
}

function isJson(item) {
	item = typeof item !== "string" ? JSON.stringify(item) : item;

	try {
		item = JSON.parse(item);
	} catch (e) {
		return false;
	}

	if (typeof item === "object" && item !== null) {
		return true;
	}

	return false;
}

function xmlToMessages(xml) {
	var settings = {};
	settings.EtReturn = {
		consider: true,
		parent: null,
		type: 'object',
		mask: 'EtReturn'
	};
	settings.item = {
		consider: true,
		parent: null,
		type: 'array'
	};
	settings.Type = {
		consider: true,
		parent: null,
		type: 'property',
		mask: 'Type'
	};
	settings.Code = {
		consider: true,
		parent: null,
		type: 'property',
		mask: 'Code'
	};
	settings.Message = {
		consider: true,
		parent: null,
		type: 'property',
		mask: 'Message'
	};
	settings.LogNo = {
		consider: true,
		parent: null,
		type: 'property',
		mask: 'LogNo'
	};
	settings.LogMsgNo = {
		consider: true,
		parent: null,
		type: 'property',
		mask: 'LogMsgNo'
	};
	settings.MessageV1 = {
		consider: true,
		parent: null,
		type: 'property',
		mask: 'MessageV1'
	};
	settings.MessageV2 = {
		consider: true,
		parent: null,
		type: 'property',
		mask: 'MessageV2'
	};
	settings.MessageV3 = {
		consider: true,
		parent: null,
		type: 'property',
		mask: 'MessageV3'
	};
	settings.MessageV4 = {
		consider: true,
		parent: null,
		type: 'property',
		mask: 'MessageV4'
	};
	return xmlToJSON(xml, settings);
}

function xmlToException(xml) {
	var settings = {};
	settings['env:listaSap'] = {
		consider: true,
		parent: null,
		type: 'property',
		mask: 'listaSap'
	};
	return xmlToJSON(xml, settings);
}

function parseXML2JSON(xml, settings, nodoData) {
	if (xml.indexOf("<env:Fault>") > -1 && xml.indexOf("</env:Fault>") > -1) {
		return {
			iCode: -1,
			sMessage: xml
		};

	}

	if (xml.indexOf("<" + nodoData + ">") > -1 && xml.indexOf("</" + nodoData + ">") > -1) {
		return {
			iCode: parseInt(bundle.getText("code.idf1"), 10),
			oData: xmlToJSON(xml, settings)
		};
	}

	if (xml.indexOf("<EtReturn>") > -1 && xml.indexOf("</EtReturn>") > -1) {
		return {
			iCode: 0,
			oData: xmlToMessages(xml)
		};
	}

	if (xml.indexOf("<" + nodoData + "/>") > -1) {
		return {
			iCode: -2,
			sMessage: 'No se encontraron datos'
		};
	}
}

function xmlToJSONAuto(xml) {
	var parser = new $.util.SAXParser();
	var rootElement;
	var characterData = [];
	var elementStack = [];

	parser.startElementHandler = function(name, attrs) {
		var data = attrs; // use attrs object with all properties as template
		data.name = name; // add the name to the object

		if (!rootElement) { // the first element we see is the root element we want to send as response
			rootElement = data;
		} else {
			var currentElement = elementStack[elementStack.length - 1];
			if (!currentElement.children) { // first time we see a child we have to create the children array
				currentElement.children = [data];
			} else {
				currentElement.children.push(data);
			}
		}
		elementStack.push(data);
	};

	parser.endElementHandler = function(name) {
		elementStack.pop();
	};

	parser.characterDataHandler = function(s) {
		var currentElement = elementStack[elementStack.length - 1];
		if (!currentElement.characterData) { // the first time we see char data we store it as string
			currentElement.characterData = s;
		} else if (!Array.isArray(currentElement.characterData)) { // if we already have a string we convert it to an array and append the new data
			currentElement.characterData = [currentElement.characterData, s];
		} else { // just append new data to the existing array
			currentElement.characterData.push(s);
		}
	};

	parser.parse(xml);

	var elements = rootElement.children;
	var dataBody = {};
	var oResult = {};
	var sMessage = "";
	var oData = {};
	for (var i = 0; i < elements.length; i++) {
		var item = elements[i];
		if (item.name.indexOf("soap-envelope:Body") > -1 || item.name.indexOf("env:Body") > -1) {
			dataBody = item.children[0];
		}
	}

	if (dataBody.name.indexOf("soap-envelope:Fault") > -1 || dataBody.name.indexOf("env:Fault") > -1) {
		oResult.iCode = -1;
		var faults = dataBody.children;
		for (i = 0; i < faults.length; i++) {
			var itemFault = faults[i];
			if (itemFault.name.indexOf("soap-envelope:Reason") > -1) {
				oResult.sMessage = itemFault.children[0].characterData;
			}
		}
		oResult.oData = null;
	} else {
		var Datos = dataBody.children;
		for (i = 0; i < Datos.length; i++) {
			var itemDatos = Datos[i];
			if (!itemDatos.children) {
				oData[itemDatos.name] = itemDatos.characterData ? itemDatos.characterData : null;
			} else {
				var DatosItem = [];
				var j = 0;
				for (i = 0; i < itemDatos.children.length; i++) {
					var newObject = {};
					var listaCampos = itemDatos.children[i].children;
					for (j = 0; j < listaCampos.length; j++) {
						var itemItem = listaCampos[j];
						newObject[itemItem.name] = itemItem.characterData ? itemItem.characterData : null;
					}
					DatosItem.push(newObject);
				}

				oData[itemDatos.name] = DatosItem;
			}
		}
		oResult.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResult.sMessage = null;
		oResult.oData = oData;
	}

	return oResult;
}

function xmlToJSONConvertToNull(valor) {
	return (valor.characterData && valor.characterData !== 'null') ? valor.characterData : null;
}


//MEJORADO
function xmlBucleToObject(Datos, isArrayData) {
	var out = !isArrayData ? {} : [];
	Datos.forEach(function(item) {
		var nombre = item.name;
		var valor = xmlToJSONConvertToNull(item);
		var hijos = item.children;
		var isArray = (item.children && item.children[0].name === 'item');

		if (isArrayData) {
            if (hijos) {
				out.push(xmlBucleToObject(hijos, isArray));
			} else {
				out.push(valor);
			}
		} else {
			if (hijos) {
				out[nombre] = xmlBucleToObject(hijos, isArray);
			} else {
				out[nombre] = valor;
			}
		}

	});
	return out;
}

function xmlToJSONBucle(itemDatos, oData) {
	if (!itemDatos.children) {
		oData[itemDatos.name] = xmlToJSONConvertToNull(itemDatos);
	} else {
		var isArray = (itemDatos.children[0].name === 'item');
		var DatosItem = isArray ? [] : {};
		var j;
		for (j = 0; j < itemDatos.children.length; j++) {
			var itemDatosSub = itemDatos.children[j];
			var valor = xmlToJSONConvertToNull(itemDatosSub);
			var childrens = itemDatosSub.children;
			var name = itemDatosSub.name;
			if (!childrens) {
				DatosItem[name] = valor;
			} else {
				var j2;
				for (j2 = 0; j2 < childrens.length; j2++) {
					var itemChild = childrens[j2];
					if (isArray) {
						DatosItem.push(xmlBucleToObject(itemDatosSub));
					} else {
						xmlToJSONBucle(itemChild, DatosItem);
					}
				}
			}
		}
		oData[itemDatos.name] = DatosItem;
	}

	return oData;
}

//xmlToJSONBucle()

function xmlToJSONAutoV2(xml) {
	var parser = new $.util.SAXParser();
	var rootElement;
	var characterData = [];
	var elementStack = [];

	parser.startElementHandler = function(name, attrs) {
		var data = attrs; // use attrs object with all properties as template
		data.name = name; // add the name to the object

		if (!rootElement) { // the first element we see is the root element we want to send as response
			rootElement = data;
		} else {
			var currentElement = elementStack[elementStack.length - 1];
			if (!currentElement.children) { // first time we see a child we have to create the children array
				currentElement.children = [data];
			} else {
				currentElement.children.push(data);
			}
		}
		elementStack.push(data);
	};

	parser.endElementHandler = function(name) {
		elementStack.pop();
	};

	parser.characterDataHandler = function(s) {
		var currentElement = elementStack[elementStack.length - 1];
		if (!currentElement.characterData) { // the first time we see char data we store it as string
			currentElement.characterData = s;
		} else if (!Array.isArray(currentElement.characterData)) { // if we already have a string we convert it to an array and append the new data
			currentElement.characterData = [currentElement.characterData, s];
		} else { // just append new data to the existing array
			currentElement.characterData.push(s);
		}
	};

	parser.parse(xml);

	var elements = rootElement.children;
	var dataBody = {};
	var oResult = {};
	for (var i = 0; i < elements.length; i++) {
		var item = elements[i];
		if (item.name.indexOf("soap-envelope:Body") > -1 || item.name.indexOf("env:Body") > -1) {
			dataBody = item.children[0];
		}
	}

	if (dataBody.name.indexOf("soap-envelope:Fault") > -1 || dataBody.name.indexOf("env:Fault") > -1) {
		oResult.iCode = -1;
		var faults = dataBody.children;
		for (i = 0; i < faults.length; i++) {
			var itemFault = faults[i];
			if (itemFault.name.indexOf("soap-envelope:Reason") > -1) {
				oResult.sMessage = itemFault.children[0].characterData;
			}
		}
		oResult.oData = null;
	} else {
		var Datos = dataBody.children;
		oResult.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResult.sMessage = null;
		oResult.oData = xmlBucleToObject(Datos);

	}

	oResult.oData.elements = elements;
	return oResult;
}

function replaceTagEmpty(xml, arrayTags, valores) {
	var i = 0;
	var valor = (valores ? valores[i] : "null");
	for (i = 0; i < arrayTags.length; i++) {
		xml = xml.replace(new RegExp("<" + arrayTags[i] + "/>", 'g'), "<" + arrayTags[i] + ">" + valor + "</" + arrayTags[i] + ">");
	}
	return xml;
}
 
function cambiarCaracteres(cadena){
                
               
                var nuevaCadena = cadena;
                // var posAmp = nuevaCadena.indexOf("&");
                 
                                nuevaCadena = nuevaCadena.replace(/&/g, '&amp;');
                                nuevaCadena = nuevaCadena.replace(/'/g, "&apos;");
                                nuevaCadena = nuevaCadena.replace(/"/g, "&quot;");
                                nuevaCadena = nuevaCadena.replace(/>/g, "&gt;");
                                nuevaCadena = nuevaCadena.replace(/</g, "&lt;");
                                nuevaCadena = nuevaCadena.replace("?", "");
                                nuevaCadena = nuevaCadena.replace(/¿/g, "&#191;");
                                nuevaCadena = nuevaCadena.replace(/NÂº/g, "Nº");
                                nuevaCadena = nuevaCadena.replace(/Ã‘/g, "N");
                                nuevaCadena = nuevaCadena.replace(/$/g, "");
                                nuevaCadena = nuevaCadena.replace(/Á/g, "&#193;");
                                nuevaCadena = nuevaCadena.replace(/É/g, "&#201;");
                                nuevaCadena = nuevaCadena.replace(/Í/g, "&#205;");
                                nuevaCadena = nuevaCadena.replace(/Ó/g, "&#211;");
                                nuevaCadena = nuevaCadena.replace(/Ú/g, "&#218;");
                                nuevaCadena = nuevaCadena.replace(/ñ/g, "&#241;");
                                nuevaCadena = nuevaCadena.replace(/Ñ/, "&#209;");
                                nuevaCadena = nuevaCadena.replace(/−/g, "&minus;");
                                nuevaCadena = nuevaCadena.replace(/@/g, "&#64;");
                return nuevaCadena;
}


//++++//