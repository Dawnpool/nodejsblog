const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { render } = require('ejs');
const blogRoutes = require('./routes/blogRoutes');

// express app
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// connect to mongodb
const dbURI = 'mongodb+srv://admin:admin@nodetuts.jmzzh.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        server.listen(3000);
    })
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // for accepting form data
app.use(morgan('dev'));

// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/chat', (req, res) => {
    res.render('chat', { title: 'Chat' })
});

// blog routes
app.use('/blogs', blogRoutes);

// 404 page
// Must be at the very bottom
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

io.on('connection', socket => {
    socket.on('login', data => {
        console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);
        socket.name = data.name;
        socket.userid = data.userid;

        io.emit('login', data.name);
    });

    socket.on('chat', data => {
        console.log('Message from %s: %s', socket.name, data.msg);

        const msg = {
            from: {
                name: socket.name,
                userid: socket.userid
            },
            msg: data.msg
        };
        
        io.emit('chat', msg);
    });

    socket.on('forceDisconnect', () => {
        socket.disconnect();
    });

    socket.on('disconnect', () => {
        console.log('user disconnected ' + socket.name);
    });
});