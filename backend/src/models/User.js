const mongoose = require('mongoose')            
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/*
  Crea un esquema de mongoose que toma un objeto. Este objeto define diferentes
  propiedades del userSchema. Mongoose lo convertirá en un documento dentro de  
  la base de datos y sus propiedades se convertirán en campos
*/
const userSchema = mongoose.Schema({            
  fullname: {                                     
    type: String,                           
    required: true,                         
    trim: true,
    uppercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
			// Comprueba si el texto introducido es un email válido
			if (!validator.isEmail(value)) {
				throw new Error({ error: "Invalid email address" });
			}
		}
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  tokens: [{             // Almacena una lista de tokens
    token: {             // Permite que el usuario inicie sesión en diferentes dispositivos y una 
      type: String,      // vez que cierra la sesión en uno de ellos, todavía estará conectado en
      required: true     // los otros dispositivos en los que inició sesión
    }
  }]
})

/*
  Permite hacer algo antes de guardar el objeto creado. Se intenta encriptar el 
  password antes de guardar el objeto, solo se usa el hash del password si se 
  modifica, por eso primero se verifica si la contraseña se modificó
*/
userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
})

/* 
  Método de instancia que utiliza el JWT para firmar el método y crear un token. 
  El método firmado espera los datos que se utilizarán para firmar el token y una
  clave JWT que puede ser una cadena aleatoria. Para este caso, se define uno en
  el archivo .env llamado JWT_KEY. Una vez creado el token, se agrega a la lista 
  de tokens del usuario, se guarda y retorna
*/
userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)    
  user.tokens = user.tokens.concat({ token })                       
  await user.save()                                               
  return token                                                    
}

/* 
  Método modelo que espera dos parámetros, el email y el password. Busca un usuario
  con el email proporcionado utilizando el método de búsqueda de mongoose. Si el 
  usuario no está disponible, arroja un error para informarle que las credenciales
  que proporcionó no son válidas. Si el email existe, compara el password recibido 
  con el password almacenado y si coinciden, devuelve ese usuario. Esta función 
  se utiliza para registrar a los usuarios en la aplicación
*/
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })                            
  if (!user) {                                                           
    throw new Error({ error: "Invalid login credentials" });     
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)  
  if (!isPasswordMatch) {                             
    throw new Error({ error: "Invalid login credentials" });
  }
  return user
}

const User = mongoose.model('User', userSchema)                            

module.exports = User                                                      