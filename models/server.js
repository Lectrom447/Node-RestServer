const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');
const morgan = require('morgan');

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/search',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
        }



        //Conectar a Base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        //Rutas
        this.routes();
    }

    async conectarDB() {
        await dbConection()
    }

    middlewares() {
        // CORS
        this.app.use(cors())

        //Log
        this.app.use(morgan('dev'))

        // Lectura y parseo del body
        this.app.use(express.json())

        // Directorio publico
        this.app.use(express.static('public'))
    }

    routes() {
       this.app.use(this.paths.auth, require('../routes/auth'));
       this.app.use(this.paths.buscar, require('../routes/buscar'));
       this.app.use(this.paths.usuarios, require('../routes/user'));
       this.app.use(this.paths.categorias, require('../routes/categorias'));
       this.app.use(this.paths.productos, require('../routes/productos'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log( `[${new Date().toISOString()}]` + ' Server ready on port:', this.port);
        })
    }
}



module.exports = Server;