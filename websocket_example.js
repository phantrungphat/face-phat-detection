var mysql = require('mysql');
var fs = require("fs");
var multer = require ('multer');
var ps = require('python-shell');


var db = mysql.createConnection({
    host: '192.168.43.178',
    user: 'user1',
    password: '1',
    database: 'iot'
});

db.connect(function(err){
    if (err) console.log(err)
    else console.log("Đã kết nối Database thành công!!!");
});

var bodyParser = require("body-parser");
const express = require('express'); //express framework to have a higher level of methods
const app = express(); //assign app variable the express class/method
var http = require('http');
var path = require("path");
var i = 5;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const server = http.createServer(app);//create a server
/**********************websocket setup**************************************************************************************/
//var expressWs = require('express-ws')(app,server);
const WebSocket = require('ws');
const s = new WebSocket.Server({ server });
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '30 days' }));
app.use('/favicon.ico', express.static('images/favicon.ico'));
//when browser sends get request, send html file to browser
// viewed at http://localhost:3000

// var imagedetect = "04.jpg"
// fs.open('textimage.txt', 'r+', function(err, fd) {
//     if (err) {
//         return console.error(err);
//     }


// fs.writeFile('textimage.txt', imagedetect,  function(err) {
//     if (err) {
//         return console.error(err);
//     }


// fs.close(fd, function(err){
//         if (err){
//            console.log(err);
//         } 
// });
// });
// });
// app.get('/py', (req, res) => {

//     const { spawn } = require('child_process');
//     const pyProg = spawn('python', ['train_model.py']);

//     pyProg.stdout.on('data', function(data) {

//         // console.log(data.toString());
//          res.write(data);
//         res.end('');
//     });
// });

// var storage = multer.diskStorage ({
//     destination : function (req, file, cb){
//         cb(null, './upload')

//     },
//     filename : function (req, file, cb){
//         cb(null, file.originalname)
//     }
// });

// var upload = multer({storage:storage});

// app.post ('/upload', upload.single("image"), function(req,res){
//     console.log(req.file);
//     res.send('Da nhan duoc image');

//     ps.PythonShell.run('model_camera.py', function (err) {
//         if (err) throw err;
//         console.log('finished');
//     });
// });

// var controlFaceDetect = "";
// app.post ('/text', upload.single("message"), function(req,res){
//     controlFaceDetect = req.query.message;
//     console.log(controlFaceDetect);
//     res.send('Da nhan duoc text');
// });

app.get('/', function(req, res) {
res.sendFile(path.join(__dirname + '/index.html'));
});



var CLIENTS = [];
//*************************************************************************************************************************
//***************************ws chat server********************************************************************************
//app.ws('/echo', function(ws, req) {
var beginstate;
var check;
s.on('connection',function(ws,req){
        CLIENTS.push(ws);
//     s.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
//      //except to the same client (ws) that sent this message
//         client.send("Ahihi do ngoc");
// });
//ws.send("Ahihi do ngoc");
/******* when server receives messsage from client trigger function with argument message *****/


ws.on('message',function(message){
console.log("Received: "+message);



    if (message == 81)
    {
        db.query("UPDATE iot SET chucnang = 1");
        check = 1;
    }
    else if (message == 80)
    {
        db.query("UPDATE iot SET chucnang = 0");
        check = 0;
    }
    else if ( message == 10)
    {
        db.query("UPDATE iot SET phongkhach = 0");
    }
    else if ( message == 11)
    {
        db.query("UPDATE iot SET phongkhach = 1");
    }
    else if ( message == 20)
    {
        db.query("UPDATE iot SET phongngu = 0");
    }
    else if ( message == 21)
    {
        db.query("UPDATE iot SET phongngu = 1");
    }
    else if ( message == 30)
    {
        db.query("UPDATE iot SET phongbep = 0");
    }
    else if ( message == 31)
    {
        db.query("UPDATE iot SET phongbep = 1");
    }
    else if ( message == 40)
    {
        db.query("UPDATE iot SET phongvesinh = 0");
    }
    else if ( message == 41)
    {
        db.query("UPDATE iot SET phongvesinh = 1");
    }
    else if ( message == 50 && check != 1)
    {
        db.query("UPDATE iot SET cua = 0");
    }
    else if ( message == 51 && check != 1)
    {
        db.query("UPDATE iot SET cua = 1");
    }
    else if ( message == 1)
    {
        db.query("UPDATE iot SET phongkhach = 1, phongvesinh = 1, phongbep = 1, phongngu = 1");
    } 
    else if ( message == 0)
    {
        db.query("UPDATE iot SET phongkhach = 0, phongvesinh = 0, phongbep = 0, phongngu = 0");
    }
    else if ( message == "OpenTheDoor" && check == 1)
    {
        db.query("UPDATE iot SET cua = 1");
    }
    else if ( message == "CloseTheDoor" && check == 1)
    {
        db.query("UPDATE iot SET cua = 0");
    }
    // var values = [
    //     [null, '1', message]
    // ];
    // db.query("INSERT INTO iot (id, time, light1) VALUES ?", [values], function (err, result) {
    // if (err) throw err;
    //     console.log("Đã thêm dữ liệu vào database");
    // });

// s.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
//     if(client!=ws && client.readyState ){ //except to the same client (ws) that sent this message
//         client.send(message);
//     }
//     else client.send("Gui tu Server ve 1");

    db.query("SELECT * FROM iot", function (err, result, fields){
        beginstate = String(result[0].phongkhach) + String(result[0].phongngu) + String(result[0].phongbep) + String(result[0].phongvesinh) + String(result[0].cua) +String(result[0].chucnang);
        console.log(beginstate);

        check = String(result[0].chucnang);

        if (message == 81)
            check = 1;
        if (message == 80)
            check = 0;

        for (var i =0; i<CLIENTS.length; i++)
        {
            if (CLIENTS[i]==ws)
                CLIENTS[i].send(beginstate);
        }
    });

    if (message == 51 || message == 50)
        if (check != 1)
        {
            for (var i =0; i<CLIENTS.length; i++)
            {
                if (CLIENTS[i].readyState && CLIENTS[i]!=ws)
                    CLIENTS[i].send(message);
            }
        }
        else
        {
            //nothing
        } 
    else if (message == "OpenTheDoor" || message == "CloseTheDoor")
        if (check == 1)
        {
            for (var i =0; i<CLIENTS.length; i++)
                {
                    if (CLIENTS[i].readyState && CLIENTS[i]!=ws)
                        CLIENTS[i].send(message);
                }
        }
        else {
            //nothing
        }
    else {
        for (var i =0; i<CLIENTS.length; i++)
        {
            if (CLIENTS[i].readyState && CLIENTS[i]!=ws)
                CLIENTS[i].send(message);
        }
    }
        

//});
//ws.send("Gui tu Server ve ne"); //send to client where message is from
});


  

ws.on('close', function(client){
console.log("lost one client");
    CLIENTS.splice(CLIENTS.indexOf(client),1);
});
//ws.send("new client connected");
console.log("new client connected");
});
server.listen(3000);