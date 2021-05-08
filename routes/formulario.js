  
var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// exibir página de usuarios
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM usuarios ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('formulario',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('formulario',{data:rows});
        }
    });
});

// exibir página para adicionar usuario
router.get('/adicionar', function(req, res, next) {    
   
    res.render('formulario/adicionar', {
        nome: '',
        email: '',
        cpfOuCnpj: '',
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado:''       
    })
})

// adicionar um novo usuario
router.post('/adicionar', function(req, res, next) {    
    let nome = req.body.nome;
    let email = req.body.email;
    let cpfOuCnpj = req.body.cpfOuCnpj;
    let logradouro = req.body.logradouro;
    let numero = req.body.numero;
    let bairro = req.body.bairro;
    let cidade = req.body.cidade;
    let estado = req.body.estado;
    let errors = false;

    if(nome.length === 0 || email.length === 0 || cpfOuCnpj.length === 0 || 
        logradouro.length === 0 || numero.length === 0 || bairro.length === 0 || cidade.length === 0 ||
        estado.length === 0) {
        errors = true;

        
        req.flash('Erro', "Por favor preencha todos os campos!");
        
        res.render('formulario/adicionar', {
            nome: nome,
            email: email,
            cpfOuCnpj: cpfOuCnpj,
            logradouro: logradouro,
            numero: numero,
            bairro: bairro,
            cidade: cidade,
            estado: estado

        })
    }

    if(!errors) {

        var form_data = {
            nome: nome,
            email: email,
            cpfOuCnpj: cpfOuCnpj,
            logradouro: logradouro,
            numero: numero,
            bairro: bairro,
            cidade: cidade,
            estado: estado
        }
        
        // insert query
        dbConn.query('INSERT INTO usuarios SET ?', form_data, function(err, result) {
            
            if (err) {
                req.flash('error', err)
                 
                res.render('formulario/adicionar', {
                    nome: form_data.nome,
                    email: form_data.email,
                    cpfOuCnpj: form_data.cpfOuCnpj,
                    logradouro: form_data.logradouro,
                    numero: form_data.numero,
                    bairro: form_data.bairro,
                    cidade: form_data.cidade,
                    estado: form_data.estado
                   
                })
            } else {                
                req.flash('success', 'Usuario adicionado com sucesso!');
                res.redirect('/formulario');
            }
        })
    }
})

// exibir pagina de edição de usuario
router.get('/editar/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM usuarios WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
       
        if (rows.length <= 0) {
            req.flash('error', 'Usuario não encontrado com id = ' + id)
            res.redirect('/formulario')
        }
        
        else {
            
            res.render('formulario/editar', {
                title: 'Editar Usuario', 
                id: rows[0].id,
                nome: rows[0].nome,
                email: rows[0].email,
                cpfOuCnpj: rows[0].cpfOuCnpj,
                logradouro: rows[0].logradouro,
                numero: rows[0].numero,
                bairro: rows[0].bairro,
                cidade: rows[0].cidade,
                estado: rows[0].estado
            })
        }
    })
})

// update 
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let nome = req.body.nome;
    let email = req.body.email;
    let cpfOuCnpj = req.body.cpfOuCnpj;
    let logradouro = req.body.logradouro;
    let numero = req.body.numero;
    let bairro = req.body.bairro;
    let cidade = req.body.cidade;
    let estado = req.body.estado;    
    let errors = false;

    if(nome.length === 0 || email.length === 0 || cpfOuCnpj.length === 0 || 
        logradouro.length === 0 || numero.length === 0 || bairro.length === 0 || cidade.length === 0 ||
        estado.length === 0) {
        errors = true;
        
        
        req.flash('error', "Por favor preencha todos os campos!");
        
        res.render('formulario/editar', {
            id: req.params.id,
            nome: nome,
            email: email,
            cpfOuCnpj: cpfOuCnpj,
            logradouro: logradouro,
            numero: numero,
            bairro: bairro,
            cidade: cidade,
            estado: estado
            
        })
    }

    
    if( !errors ) {   
 
        var form_data = {
            nome: nome,
            email: email,
            cpfOuCnpj: cpfOuCnpj,
            logradouro: logradouro,
            numero: numero,
            bairro: bairro,
            cidade: cidade,
            estado: estado
        }
        // update query
        dbConn.query('UPDATE usuarios SET ? WHERE id = ' + id, form_data, function(err, result) {
            
            if (err) {
                
                req.flash('error', err)
                
                res.render('formulario/editar', {
                    id: req.params.id,
                    nome: form_data.nome,
                    email: form_data.email,
                    cpfOuCnpj: form_data.cpfOuCnpj,
                    logradouro: form_data.logradouro,
                    numero: form_data.numero,
                    bairro: form_data.bairro,
                    cidade: form_data.cidade,
                    estado: form_data.estado
                })
            } else {
                req.flash('success', 'Usuario atualizado com sucesso');
                res.redirect('/formulario');
            }
        })
    }
})
   
// delete
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM usuarios WHERE id = ' + id, function(err, result) {
        
        if (err) {
            
            req.flash('error', err)
            
            res.redirect('/formulario')
        } else {
            
            req.flash('success', 'Usuario deletado com sucessp! ID = ' + id)
            
            res.redirect('/formulario')
        }
    })
})

module.exports = router;