const auth = require('../middleware/auth')              
const express = require('express')
const User = require('../models/User')

/* Crea los controladores de las rutas */
const router = express.Router()

/*
  Crea un nuevo usuario con toda su información suministrada a la que accedemos 
  desde req.body. Después de guardar al usuario, se genera un token de autenticación
  y lo devuelve como respuesta junto con los datos del usuario. 
*/
router.post('/users', async (req, res) => {
  try {
	  const user = new User(req.body);
		await user.save();
		const token = await user.generateAuthToken(); 
		res.status(201).send({ user, token }); 
	} catch (error) {
    // res.status(400).send(error);
    res.status(400).json({ error: "User already registered!" });
  }
})

/* Inicio de sesión de un usuario registrado */
router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findByCredentials(email, password)
    /* if (!user) {
      return res.status(401).send({error: 'Login failed! Check authentication credentials'})
    } */
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    // res.status(400).send(error)
    res.status(400).send({ error: "Login failed! Check authentication credentials" });
  }
})

/* Obtener perfil de usuario */
router.get('/users/me', auth, async (req, res) => {      
  // Ver profile del usuario logeado               
  res.send(req.user)                
})

/* 
  Cierra la sesión de usuario de la aplicación. Filtra la matriz de tokens del usuario y
  devuelve true si alguno de los tokens no es igual al token que utilizó el usuario para
  iniciar sesión. Despúes guarda el usuario
*/
router.post('/users/me/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		//res.send();
		res.send({ message: "User session closed on device" });
	} catch (error) {
		res.status(500).send(error);
	}
});

/* 
  Cierra la sesión de usuario en todos los dispositivos. Elimina los tokens de la matriz 
  de tokens y guarda el documento del usuario
*/
router.post('/users/me/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);    
    await req.user.save();
    //res.send();
    res.send({ message: 'User session closed on all devices' });
	} catch (error) {
    res.status(500).send(error)
  }
})

/* 
  Cambia el password del usuario. Recibe la informacion del req.body y lo asigna al nuevo 
  password, luego guarda el documento del usuario
*/ 
router.post('/users/me/changepass', auth, async (req, res) => {       
  try {
    req.user.password = req.body.password;
    await req.user.save();
    res.send({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).send(error);
  } 
});

module.exports = router