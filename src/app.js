import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import { messageModel } from './dao/mongo/models/messages.model.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import config from './config/config.js';
import { addLoggerDev } from './utils/loggers/logger.development.js';
import { addLoggerProd } from './utils/loggers/logger.production.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';


import router from './routes/index.js';
import views from './routes/views.router.js';

//logger
const isDev = process.env.NODE_ENV === 'development';
const addLogger = isDev ? addLoggerDev : addLoggerProd;

const port = 8080;
const messages = [];
const app = express();
const httpServer = app.listen(port, () => { console.log(`Server listening at http://localhost:${port}`); });
const io = new Server(httpServer);

//conexión mongoDB
mongoose.connect(config.mongoUrl);

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Middlewares
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(addLogger);

//Session
app.use (session ({
    store: MongoStore.create({
        mongoUrl: config.mongoUrl,
    }),
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
}));

//Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación Ecommerce",
            description: "La documentación de los endpoints"
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use ("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//Rutas
app.use("/api", router);
app.use("/", views);

//Sockets
io.on('connection', async (socket) => {
    console.log("Nuevo cliente conectado");

    try {
        const messages = await messageModel.find();
        io.emit('messageLogs', messages);
    } catch (error) {
        console.error("Error al obtener los mensajes:", error);
    }

    socket.on('message', async (data) => {
        try {
            await messageModel.create(data);
            const messages = await messageModel.find();
            io.emit('messageLogs', messages);
        } catch (error) {
            console.error("Error al guardar el mensaje:", error);
        }
    });
});

