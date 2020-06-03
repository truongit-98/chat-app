import Session from "express-session";
import mongoStore from "connect-mongo";
import config from '../config/index.mjs';
import db from '../db/index.mjs';

var session ;
if (process.env.NODE_ENV === 'production') {
    session = Session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        store: new mongoStore({
            mongooseConnection: db.mongoose.connection
        })
    })
} else {
    session = Session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true
    });
}
export default session;