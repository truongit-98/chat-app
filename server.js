import express from "express";
import logger from "morgan";
import path from "path";
import passport from 'passport';
import chatApp from "./app/index.mjs";
import routers from "./app/routers/index.mjs"
const app = express();


app.set('__dirname', path.resolve());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(app.get('__dirname'), 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(express.static(path.join(app.get('__dirname'), 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'));
app.use(chatApp.session);

app.use(passport.initialize());
app.use(passport.session());

//router
app.get('/', (req, res, next) => {
    res.redirect('/login');
});
app.get('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/');
})

app.use('/login', chatApp.routers.loginRouter);
app.use('/auth', chatApp.routers.authRouter);
app.use('/chat', chatApp.routers.chatRouter);
app.use('/register', chatApp.routers.registerRouter);


//error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(err);
    res.render('error');
});
chatApp.IoServer(app).listen(app.get('port'), () => {
    console.log(`ChatApp listenning on ${app.get('port')}!`);
})
