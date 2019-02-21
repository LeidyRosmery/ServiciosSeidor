var nameSpaceFile = "Demo";
var textAccess = $.import("sap.hana.xs.i18n", "text");
var bundle = textAccess.loadBundle(nameSpaceFile + ".I18n", "messaje");
var config = textAccess.loadBundle(nameSpaceFile + ".Config", "config");
//el esquema es el USERTEST
var esquema = config.getText("bd.esquema.usertest");
var conn = $.hdb.getConnection();
//metodo para listar la data de los usuarios

function ListarDataUsuario() {
	var rs;
	var oResponse = {};
	var aLsUsuario = [];
	var aParam = [];
	var aCampos = [
					    '"IDUSUARIO"',
					    '"USUARIO"',
					    '"NOMBRE"',
					    '"APELLIDO"',
					    '"DIRECCION"',
					    '"CIUDAD"',
					    '"PAIS"'
				    ];
	var pathQuery;
	try {
	    //var IdScp = $.session.getUsername();
		pathQuery = 'select ' + aCampos.join(", ") + '  from ' + esquema + '."VUSUARIO"';
		aParam.unshift(pathQuery);
		rs = conn.executeQuery.apply(conn, aParam);		
		var result = rs.getIterator();
		var row;
		while (result.next()) {
			row = result.value();
				//Se esta creando al usuario con esos atributos.
			aLsUsuario.push({
				"sIdUsuario": row.IDUSUARIO,
				"sUsuario": row.USUARIO,
				"sNombre": row.NOMBRE,
				"sApellido": row.APELLIDO,
				"sDireccion": row.DIRECCION,
				"sCiudad": row.CIUDAD,
				"sPais": row.PAIS
			
			});
		}
		if (aLsUsuario.length > 0) {
			oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage = bundle.getText("msj.idf1");
			oResponse.oData = aLsUsuario;
		} else {
			oResponse.iCode = parseInt(bundle.getText("code.idf2"), 10);
			oResponse.sMessage = bundle.getText("msj.idf2");
		}
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1", ["DAO Metodo: DataUsuario - " + e.toString()]);
	}
	return oResponse;
}
