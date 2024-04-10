let express = require('express')
let bodyParser = require('body-parser')
let compression = require('compression')
let helmet = require('helmet')
let userRouter = require('./userRoutes')

const socketIo = require('socket.io');
let http = require('http')

// Load environment variables from .env file
require('dotenv').config();
const app = express();

// Create an HTTP server
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bcrypt = require('bcrypt');

// app.use(expressValidator());

app.use(helmet());

app.use(compression());

app.use('/', userRouter);

const io = socketIo(server);

// Define event handlers for socket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle events when a client sends a message
    socket.on('message', (message) => {
        console.log('Message received:', message);
        // Broadcast the message to all connected clients
        io.emit('message', message);
    });

    // Handle disconnection of a client
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Custom error handler middleware
// app.use(errorHandler);


app.use(bodyParser.json())

// Start the Express server
const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
    console.log(`server starts at port ${port}`)
})


