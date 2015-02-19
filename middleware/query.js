/**
 * Created by mankind on 20/02/15.
 */
var mysql       = require('mysql');
var connection = mysql.createConnection(
    {
        host     : '127.0.0.1',
        user     : 'root1',
        password : 'admin123',
        database : 'vetnetwork'
    }
);

connection.connect(function(err) {
    if ( !err ) {
        console.log("Connected to MySQL");
    } else if ( err ) {
        console.log(err);
    }
});

function MyQueryProcessor(token, uid) {
    this.token      = token;
    this.uid        = uid;
}

MyQueryProcessor.prototype.checkRequest = function() {

};

MyQueryProcessor.prototype.getData = function(callback) {

    var result      = 0;
    var queryString = "SELECT vnf_message AS message FROM vn_notification WHERE vnf_user_id = ? AND vnf_type = 'booking' AND vnf_message_status = 'pending'";

    connection.query(queryString,[this.uid], function(err, rows, fields) {
        if (err) throw err;

        if (rows) {

            result = { "count" : rows.length,"notifications" : rows };
            callback(null, JSON.stringify(result));
        }
        else{
            result = { "count" : 0,"notifications" : rows };
            callback(null, JSON.stringify(result));
        }
    });
};

//connection.end();

module.exports = MyQueryProcessor;