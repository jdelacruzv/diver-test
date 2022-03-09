# Create Auth with JWT - Express - MongoDB

### 1. Create database in MongoDB Atlas
See [MongoDB Atlas](https://www.mongodb.com/atlas/database)

### 2. Set file structure for the project
```
- backend
  - node_modules
  - src 
    - db
      - db.js
    - middleware
      - auth.js
    - models
      - User.js
    - routers
      - user.js
    - index.js
  - .env
  - package-lock.json
  - package.json
```

### 3. Install required NPM packages
- [express](https://www.npmjs.com/package/express): fast, unopinionated, minimalist web framework for node
- [mongoose](https://www.npmjs.com/package/mongoose): mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment
- [bcrypt](https://www.npmjs.com/package/bcrypt): a library to help you hash passwords
- [validator](https://www.npmjs.com/package/bcrypt): a library of string validators and sanitizers
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): An implementation of JSON Web Tokens
- [dotenv](https://www.npmjs.com/package/dotenv): loads environment variables from a .env file into process.env
- [nodemon](https://www.npmjs.com/package/nodemon): automatically restarts the application when file changes are detected in the directory

### 4. Define environment variables
```
Create file:

.env
```

### 5. Create server with express
```
src/index.js
```

### 6. Create database connection
```
src/db/db.js
```

### 7. Create user model
```
src/models/User.js
```

### 8. Create users and login routes
```
src/routers/user.js 

Create the following routes:
 - HTTP POST / users => register user
 - HTTP POST / users / login => login registered user
```

### 9. Create authentication middleware
```
src/middleware/auth.js

Create route:
 - HTTP GET / users / me => get user profile

Edit file: 
 - src/routers/user.js
```

### 10. Routes logout, logoutall and changepass
```
Create the following routes:
 - HTTP POST / users / me / logout => logout user
 - HTTP POST / users / me / logoutall => signout of all connected devices
 - HTTP POST / users / me / changepass => modify user password

Edit file:
 - src/routers/user.js
```