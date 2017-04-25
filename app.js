var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var weather = require("openweather-node");
var mysql = require('mysql');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var hostname = 'localhost';
var port = 8080;
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var connection = mysql.createConnection({
    host     : 'localhost',
    port     :  3306, //Port number to connect to for the DB.
    user     : 'root', //!!! NB !!! The user name you have assigned to work with the database.
    password : '123456', //!!! NB !!! The password you have assigned
    database : 'fis_assignment' //!!! NB !!! The database you would like to connect.
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

function dbData() {
    setInterval(function () {

        connection.query('SELECT * FROM pallet_info', function (err, rows) {
            if (err) {
                console.error(err);
            }
            else {
                /*var pallet_id = [];
                var order_id = [];
                var ws_num = [];
                var ws_zone = [];
                var pallet_status = [];
                for(var i = 0; i<rows.length ; i++){
                    pallet_id = pallet_id.push(rows[i].pallet_id);
                    order_id = order_id.push(rows[i].order_id);
                    ws_num = ws_num.push(rows[i].ws_number);
                    ws_zone = ws_zone.prows[i].ws_zone;
                    pallet_status = pallet_status.push(rows[i].pallet_status);
                }*/
                var data = [];
                var dataJSON;
                for(var i =0; i<rows.length; i++){
                    // var order_id = rows[i].order_id;
                    // var pallet_id = rows[i].pallet_id;
                    // var ws_num = rows[i].ws_number;
                    // var ws_zone = rows[i].ws_zone;
                    // var pallet_status = rows[i].pallet_status;
                    dataJSON = {"order_id": rows[i].order_id, "pallet_id":rows[i].pallet_id, "ws_num":rows[i].ws_number, "ws_zone":rows[i].ws_zone, "pallet_status":rows[i].pallet_status}
                    data.push(dataJSON);
                }
                console.log("************",data);
                io.sockets.emit('data_port', data);
                // io.sockets.emit('orderID_port', order_id);
                // io.sockets.emit('wsNUM_port', ws_num);
                // io.sockets.emit('wsZONE_port', ws_zone);
                // io.sockets.emit('palletStatus_port', pallet_status);
            }
        });
    },6000);
}
dbData();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;