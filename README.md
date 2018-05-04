# nodeJsRequestHandler

1. What is the project about?

When dealing with data in a database using node.js, you are writing queries in source code. I want to manage the query and the source separately, so I store the query in the database and try to map the program_id for that query. In the node.js source, when the program_id is inputted and when a request is generated, a project mapped to the program_id is fetched and executed.

1 ) Register query

2 ) Use RequestHandler

Enter the program_id to be executed in the requesthandler and input the parameter, and execute the mapped sql to get the result value.
var requesthandler = require('../lib/requesthandler.js');
....
router.route('/user/:user_id')
    .get(function(req, res, next) {
        var param = new Array();
        param.push({user_id: req.params.user_id});
        requesthandler('USER-GETINFO', param, function(err, val){
            if(err) {
                console.log(err);
                res.render('user/info', { error : err});
            } else {
                res.render('user/info', { user_info : val});
            }
        });
    });

2. Technology Stack

1 ) languages : javascript

2 ) technical requirements : node.js, npm

3. Roadmap

1 ) Create the table to manage sql

2 ) Create Express Project(Already)

3 ) Develop requesthandler.js

4 ) Develop Web Page to register program_ids.

5 ) Enhancement.
