// Module dependencies
var express    = require('express'),
    mysql      = require('mysql'),
    port       = 7000;

var app = express();

// Converts JSON to HTML table
function convertToTable(json){
    var table = '<table>';

    for (x in json){
        table += '<tr>';

        for (y in json[x]){
            table = table + '<td>' + json[x][y] + '</td>';
        }

        table += '</tr>';
    }
    table += '</table>';
    return table;
}

// Main route sends our HTML file
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Update MySQL database
app.post('/', function (req, res) {
    // Application initialization
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'nate',
        database : 'rainbow'
    });
    
    //connect to MySQL
    connection.connect(function(err) {
      if (err){
       console.log("Cannot connect to database");
       throw err;
      }
      console.log("connected to db");      
    });

    // Query MySQL
    var query = 'SELECT * FROM color;';
    connection.query(query, function (err, result) {
        if (err){
          console.log("error with query")
          throw err;
        }
        console.log('query sent\n');
        var table = convertToTable(result);
        res.send(table);
        connection.end();
    });
});

// Begin listening
app.listen(port);
console.log("Express server listening on port %d in %s mode\n", port, app.settings.env);