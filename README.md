# game-store

crear un archivo .env en la carpeta raiz

agregar las siguientes variables de entorno

PORT=puerto donde correra la app

MONGO_URI= conexión con mongodb

TOKEN_SIGNATURE= una clave para la validación de nuestros tokens

SALT= variable para el tiempo que tarda en expirar el token (variable numerica)

REDIS_URI= conexión con redis

REDIS_TTL= tiempo de vida de nuestra cache(variable numerica)

CLOUDINARY_NAME= 

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET= todos los datos que nos brinda cloudinary en nuestra cuenta para conectarse a sus servicios

NODE_ENV=development // variable que se usa para los test

para instalar las dependencias =
npm install 

correr la app =
npm run start
