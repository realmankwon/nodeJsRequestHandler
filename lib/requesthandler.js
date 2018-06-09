var mysql = require('mysql');
var async = require('async');
var dbConfig = require('./config/database_new');

var debug = require('debug');
var errorDebug = new debug('request:error');
var executeDebug = new debug('request:execute');
var connectionDebug = new debug('request:connection');

requesthandler = function(program_id, param, cb)
{
  // when param is null, assign array to param. 
  if(param == null){
	param = new Array();
	param.push('');
  }	
  
  var pool = mysql.createPool(dbConfig);

  pool.getConnection(function(err, connection){
    if(err){
			connectionDebug(err);
			cb(err);
      return;
    }

 	  connection.config.queryFormat = function (query, values) {
      if (!values) return query;
   	  return query.replace(/\:(\w+)/g, function (txt, key) {
     	  if (values.hasOwnProperty(key)) {
       	  return this.escape(values[key]);
	      }
        return txt;
   	  }.bind(this));
	  };

		connection.beginTransaction(function(err){
			if(err) {
				endConncetion(err);
				errorDebug(err);
				return;
			}
		
		console.log(program_id);
		
	    var getSqlCmd = 'select sql_statement, sql_typ from frm_prg where program_id = :program_id';

			var i = 0;
			
			var result;

  	  		connection.query(getSqlCmd, {program_id : program_id}, function(err, sqlInfo, fields) {
  	  			if(err) {
    				console.log(err);
		  	    } else {
					//connectionDebug(param[i]);
			 		try{
		 			console.log(param[i]);
			 		connection.query(sqlInfo[0].sql_statement, param[i], function(err, results, fields){
						if(err) {
            				console.log(err);
	  		  	      	} else {
							if(sqlInfo[0].sql_typ == 'I'){
								executeDebug ('insert id : ' + results.insertId);
							}	else if(sqlInfo[0].sql_typ == 'U') {
								executeDebug('changed ' + results.changedRows + ' rows');
							}	else if(sqlInfo[0].sql_typ == 'D') {
								executeDebug('deleted ' + results.affectedRows + ' rows');
							}	else if(sqlInfo[0].sql_typ == 'S') {
								executeDebug('selected ' + results.length + ' rows');
								result = results;
							}
							i++;
	  	  	      		}
	    		    }); // end of query (excute sql)
			 		}
	  	  	      	catch(e){
        				console.log(e);
	  	  	      	}
				
  	    		} // end of if-else
    		}); // end of query (get program)
				
		});	// end of transaction

		function endConnection (err) {
		  if(err) {
				console.log(err);
		 	}
			else{
		   	connection.release();
		  //  console.log('return database connection');
			}
	  } // end of endConnection
	
		function rollback(err){
			connection.rollback(function(){
				console.log('rollback');
				console.log(err);
			});
		} // end of rollback

		function commit(){
			connection.commit(function(err){
				if(err){
					rollback(err);
					return;
				}

		//		console.log('commit');
			});
		} // end of commit
	});	// end of get connection 
}
 
module.exports = requesthandler;
