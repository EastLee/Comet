var http = require("http");
var fs = require("fs");
var num = 0;
http.createServer(function(req, res) {
    var index = "./sse.html";
    var fileName;
    var interval;
    
    if (req.url === "/") {
        fileName = index;
    } else {
        fileName = "." + req.url;
    }

    if (fileName === "./stream") {
        console.info("开始连接！");
        res.writeHead(200, { 
            "Content-Type": "text/event-stream", 
            "Cache-Control": "no-cache", 
            "Connection": "keep-alive" 
        });
        res.write("retry: 1\n");
        res.write("event: connecttime\n");
        res.write("id: " + num++ + "\n");
        res.write("data: " + (new Date()) + "\n\n");
        res.write("id: " + num++ + "\n");
        res.write("data: " + (new Date()) + "\n\n");
        res.write("id: " + num++ + "\n");
        res.write("data: {\n");
        res.write('data: "foo": "bar",\n');
        res.write('data: "baz", 555\n');
        res.write("data: }\n\n");

        interval = setInterval(function() {
            res.write("id: " + num++ + "\n");
            res.write("data: " + (new Date()) + "\n\n");
        }, 2000);
        req.connection.addListener("close", function() {
            console.info("close!!!");
            clearInterval(interval);
        }, false);

    } else if (fileName === index) {
        fs.exists(fileName, function(exists) {
            if (exists) {
                fs.readFile(fileName, function(error, content) {
                    if (error) {
                        res.writeHead(500);
                        res.end();
                    } else {
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(content, "utf-8");
                    }
                });
            } else {
                res.writeHead(404);
                res.end();
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }

}).listen(8000, "localhost");
console.log("Server running at http://127.0.0.1:8000/");
