    require('crypto').randomBytes(16, function(ex, buf) {  
		        var token = buf.toString('hex');  
				        console.log(token);  
						    });  
