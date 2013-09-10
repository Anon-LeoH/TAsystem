db = require("./dbopt");

var check = {};

require('crypto').randomBytes(16, function(ex, buf) {  
                check["1"] = buf.toString('hex');  
});


console.log(check["1"]);
