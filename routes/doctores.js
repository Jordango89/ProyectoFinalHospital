var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM doctores', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('doctores', { title: 'doctores', doctores: results, opcion: 'disabled', estado: true }) //Se agrega la linea de opcion para desabilitar la opcion de modificar los campos
        }
    });
});

//Habilita la opcion enviar cuando actualizamos los datos
router.get('/enviar/:clave', function (req, res, next) {
    const clave = req.params.clave;
    connection.query('SELECT * FROM doctores', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('doctores', { title: 'doctores', claveSeleccionada: clave, doctores: results, opcion: 'disabled', estado: false })
        }
    });
});

//Codigo para hacer dinamico agregar doctor Se desaparece la especialidad ya asignada a doctor
router.get('/agregar-doctor', function (req, res, next) {
    connection.query('SELECT especialidad FROM doctores', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {

            let especialidades = ['Medicina general', 'Cardiología', 'Medicina interna', 'Dermatología', 'Rehabilitación física', 'Psicología', 'Odontología', 'Radiología']
            let resultsEspecialidades = results.map(objeto => objeto.especialidad);//separar packete 
            let resultsSinRepetidos = especialidades.filter((elemento) => {//filtrar repetidos
                return !resultsEspecialidades.includes(elemento);
            });
            res.render('registro-doctores', { layout: 'registro', especialidades: resultsSinRepetidos })
        }
    });
});

//Agregar Doctores
router.post('/agregar', (req, res) => {
    const cedula = req.body.cedula;
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const correo = req.body.correo;
    const consultorio = req.body.consultorio;
    const especialidad = req.body.especialidad;
    connection.query(`INSERT INTO doctores (cedula, nombres, apellidos, especialidad,consultorio, correo) VALUES (${cedula},'${nombres}', '${apellidos}', '${especialidad}', '${consultorio}', '${correo}')`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/doctores');
        }
    });
})

//eliminar Doctores
router.get('/eliminar/:cedula', function (req, res, next) {
    const cedula = req.params.cedula
    connection.query(`DELETE FROM cita_medica WHERE id_doctor=${cedula}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            connection.query(`DELETE FROM doctores WHERE cedula=${cedula}`, (error, results) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.redirect('/doctores')
                }
            });
        }
    });
});

//Actualizar Doctor
router.post('/actualizar/:cedula', (req, res) => {
    const cedula = req.body.cedula;
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const correo = req.body.correo;
    const consultorio = req.body.consultorio;
    const especialidad = req.body.especialidad;
    connection.query(`UPDATE doctores SET nombres='${nombres}', apellidos='${apellidos}', correo=${correo}, consultorio=${consultorio}, especialidad=${especialidad} WHERE cedula=${cedula}`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/doctores');
        }
    });
})

module.exports = router;