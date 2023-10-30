import winston from "winston";

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },     
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "white"
    }
};

winston.addColors(customLevelOptions.colors);

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({ level: 'info',
    format: winston.format.combine(
        winston.format.colorize({colors: customLevelOptions.colors}),
        winston.format.simple()
    )}),
        new winston.transports.File({ filename: "./src/logs/errors.log", level: "error", format: winston.format.simple()})
    ]
})

export const addLoggerProd = (req, res, next) => { 
    req.logger = logger
    next();
}