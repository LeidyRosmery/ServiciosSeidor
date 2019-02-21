/* tslint:disable:no-empty */
var nameSpaceFile = "Demo";
var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle(nameSpaceFile+".Config","config");
var bundle 						= textAccess.loadBundle(nameSpaceFile+".I18n","messaje");
var utils 						= $.import(nameSpaceFile+".Utils","Utils");
var usuarioCnDao 				= $.import(nameSpaceFile+".Dao.Prueba","UsuarioCnDao");
var oResponse					= {};



function ListarDataUsuario() {
	try {	
		
		//oFiltro.sIdScp 		 		= oParam.oData.sIdScp;
		//1. Buscamos los usuarios segun filtro
		var ListarDataUsuarioResponse = usuarioCnDao.ListarDataUsuario();
		
		if(ListarDataUsuarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(ListarDataUsuarioResponse.sMessage,'',ListarDataUsuarioResponse.iCode);
		}
		
		oResponse.oData = ListarDataUsuarioResponse.oData;
		oResponse.iCode =  parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode = e.lineNumber;
			oResponse.sMessage = e.message;
		}else{
			oResponse.iCode =  parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage = bundle.getText("msj.idt2",[e.toString()]);
		}	
	}
	return oResponse;
}