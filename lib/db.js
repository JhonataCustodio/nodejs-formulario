var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'formulario_cadastro'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Banco de dados conectado..!');
	}
});

module.exports = connection;