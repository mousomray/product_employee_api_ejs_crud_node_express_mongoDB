const express = require('express'); // Import express
const dotenv = require('dotenv'); // Import dotenv
const cors = require('cors'); //to allow our API to be accessed from other websites or domains.
const connectDB = require('./app/config/db.js'); // Connect with Database

// For to Handle cookie and flash message 
const session = require('express-session'); // Import session 
const cookieParser = require('cookie-parser'); // Import cookie 
const flash = require('connect-flash'); // Import flash

dotenv.config();//config() specifically because it’s the method provided by the dotenv package to read the .env file and load its contents into process.env. This config() method initializes and makes environment variables accessible across the application.

const app = express();

connectDB();

/**setup cookie and session for to use flash */
app.use(cookieParser());
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'myprojectwebskitters',
    resave: false,
    saveUninitialized: false
}))
app.use(flash()); // Use Flash

//globaly variable set for operation (like sucess , error) message
app.use((req, res, next) => {
    res.locals.sucess = req.flash('sucess'),
        res.locals.err = req.flash('err')
    next()
})

// For to View ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

// Make File static
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));


app.use(express.urlencoded({ extended: true }));//The code `app.use(express.urlencoded({ extended: true }));` allows your Express app to parse URL-encoded data from form submissions, enabling access to form fields in `req.body`. extended:true allow nested object and false doesn't allow nested object

app.use(express.json()); // Use express
app.use(cors()); // Use cors

// homeUI (Mother Routing)
const homeuirouter = require('./app/router/uirouter/homeuirouter');
app.use('/', homeuirouter);

// productUI (Mother Routing)
const productuirouter = require('./app/router/uirouter/productuirouter');
app.use('/', productuirouter);

// employeeUI (Mother Routing)
const employeeuirouter = require('./app/router/uirouter/employeeuirouter');
app.use('/', employeeuirouter);

// productAPI (Mother Routing)
const productrouter = require('./app/router/apirouter/productrouter');
app.use('/api', productrouter);

// employeeAPI (Mother Routing) 
const employeerouter = require('./app/router/apirouter/employeerouter');
app.use('/api', employeerouter);

const port = 3004
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});