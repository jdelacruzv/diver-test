const jwt = require('jsonwebtoken')
const User = require('../models/User')

/*
  Obtiene el token del req.header y dado que el token viene en un formato de Bearer[space]token,
	reemplazamos Bearer [space] con vacio ('') y verifica si el token recibido es válido o fue 
  creado usando la JWT_KEY. Intenta encontrar un usuario con esa credencial y si el token está 
  en la matriz de tokens del usuario. Adjunta el usuario y el token a la solicitud. 
  next() para ir al siguiente middleware. Si no se llama a next(), la aplicación se congelaría 
  en  ese punto y no procedería a ejecutar el resto del código
*/
const auth = async (req, res, next) => {
	const token = req.header("Authorization").replace("Bearer ", "");
	const data = jwt.verify(token, process.env.JWT_KEY);
	try {
		const user = await User.findOne({ _id: data._id, "tokens.token": token });
		if (!user) {
			throw new Error();
		}
    req.user = user;
		req.token = token; 
		next();
	} catch (error) {
		res
			.status(401)
			.send({ error: "Not authorized to access this resource" });
	}
}

module.exports = auth;