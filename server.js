var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var pg         = require('pg');
var jwt        = require('jsonwebtoken'); 

var port = process.env.PORT || 3000; 
var database = process.env.DATABASE_URL || 'postgres://localhost:5432/api-oso';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('public'));

app.set('secret','tiThighEem1');

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ data: 'Welcome the the real world!' });   
});

// authenticate
router.post('/auth', function(req, res) {
	const username = req.body.username;
	const password = req.body.password;

	pg.connect(database, (err, client, done) => {
		if(err) { done(); console.log(err); return res.status(500).json({success: false, data: err}); }
		const query = client.query('SELECT * FROM users WHERE username=($1) AND password=($2)',[username, password]);

		query.on('end', function(result) { 
			done(); 
			if (result.rowCount) {
				var token = jwt.sign(username, app.get('secret'), { expiresIn: 86400 });
				return res.json({success: true, data: 'Authentication ok', token: token});
			}
			return res.status(401).json({success: false, data: 'Authentication failed'}); 
		});
	});
});

// middleware to check token
router.use(function(req, res, next) {
	// check header, url or post
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	if (token) {
		jwt.verify(token, app.get('secret'), function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.status(403).json({success: false, data: 'No token'})
	}
});


// list user
router.get('/users', function(req, res) {
	const results = [];
  
	pg.connect(database, (err, client, done) => {
		if(err) { done(); console.log(err); return res.status(500).json({success: false, data: err}); }

		const query = client.query('SELECT * FROM users ORDER BY id ASC');
		query.on('row', (row) => { results.push(row); });
		query.on('end', () => { done(); return res.json({success: true, data: results}); });
	});
});

// get user
router.get('/users/:user_id', function(req, res) {
	const id = req.params.user_id;
  
	pg.connect(database, (err, client, done) => {
		if(err) { done(); console.log(err); return res.status(500).json({success: false, data: err}); }

		const query = client.query('SELECT * FROM users WHERE id = ($1)', [id]);
		query.on('end', () => { done(); return res.json({success: true, data: results}); });
	});
});

// add user
router.post('/users', function(req, res) {
	const results = [];
	const username = req.body.username;
	const password = req.body.password;
	const role = req.body.role;

	pg.connect(database, (err, client, done) => {
		if(err) { done(); console.log(err); return res.status(500).json({success: false, data: err}); }

		const query = client.query('INSERT INTO users(username, password,role) values($1, $2, $3)',[username, password, role]);
		query.on('end', () => { done(); return res.status(200).json({success: true, data: results}); });
	});
});

// update user
router.put('/users/:user_id', function(req, res) {
	const results = [];
	const id = req.params.user_id;
	const username = req.body.username;
	const password = req.body.password;
	const role = req.body.role;

	pg.connect(database, (err, client, done) => {
		if(err) { done(); console.log(err); return res.status(500).json({success: false, data: err}); }

		const query = client.query('UPDATE users SET username=($1), password=($2),role=($3)) WHERE id=($4)',[username, password, role, id]);
		query.on('end', () => { done(); return res.json({success: true, data: results}); });
	});
});

// delete user
router.delete('/users/:user_id', function(req, res) {
	const results = [];
	const id = req.params.user_id;
	
	pg.connect(database, (err, client, done) => {
		if(err) { done(); console.log(err); return res.status(500).json({success: false, data: err}); }

		const query = client.query('DELETE FROM users WHERE id=($1)',[id]);
		query.on('end', () => { done(); return res.json({success: true, data: results}); });
	});
});

app.use('/api', router);

app.listen(port);
console.log('Listen on port ' + port);
