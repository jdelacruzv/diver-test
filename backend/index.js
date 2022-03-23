const express = require("express");
const userRouter = require("./src/routers/user");
const cors = require("cors");
require("dotenv").config();
require("./src/db/db");

/* Asigna el puerto que viene del archivo .env */
const PORT = process.env.PORT || 5000;

/* Crea una instancia de express */
const app = express();

/* Middlewares */
app.use(express.json());
app.use(
	cors({
		origin: process.env.CORS_DOMAIN || "*",
	})
);

/* Rutas */ 
app.use("/users", userRouter);

/* Las conexiones son escuchadas por PORT */
app.get('/', (req, res) => {
	res.send('<h1>server running successfully</h1>')
});

/* Las conexiones son escuchadas por PORT */
app.listen(PORT, () => {
	console.log(`server listeting on: http://localhost:${PORT}`);
});
