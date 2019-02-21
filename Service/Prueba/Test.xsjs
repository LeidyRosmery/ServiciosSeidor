//var nameSpaceFile = "Test";
//var TxDao = $.import(nameSpaceFile + ".Dao.Usuario", "UsuarioCnDao");
////var param = { oData:{ sIdScp:"JNAVARRO"}};
//var res = TxDao.ListarDataUsuario();
//$.response.status = $.net.http.OK;
//		$.response.contentType = 'application/json';
//		$.response.setBody(JSON.stringify(res));
		
		var nameSpaceFile = "Demo";
		var TxDao = $.import(nameSpaceFile + ".Business.Prueba", "UsuarioCnBusiness");
		//var param = { oData:{ sIdScp:"JNAVARRO"}};
		var res = TxDao.ListarDataUsuario();
		$.response.status = $.net.http.OK;
				$.response.contentType = 'application/json';
				$.response.setBody(JSON.stringify(res));