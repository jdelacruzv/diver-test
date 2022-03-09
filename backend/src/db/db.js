const mongoose = require('mongoose')            

/* Los process.env. vienen del archivo .env */
const dbUser = process.env.DB_USER;
const dbPass= process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const host = `mongodb+srv://${dbUser}:${dbPass}@diverit.kaopq.mongodb.net/${dbName}?retryWrites=true&w=majority`;

/* Conexión a la bd*/ 
mongoose.connect(host);