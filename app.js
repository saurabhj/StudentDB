
/**
 * Module dependencies.
 * Test project by Saurabh Jain
 */

var express = require('express')
  , routes = require('./routes')

var StudentProvider = require('./studentprovider').StudentProvider;
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
var studentProvider = new StudentProvider('localhost', 27017);

app.get('/', routes.index);

// New Student
app.get('/student/new', function(req, res) {
	res.render('new_student.jade')
});

// Save New Student
app.post('/student/new', function(req, res) {
	studentProvider.save({
		roll_number: req.param('roll_number'),
		student_name: req.param('student_name'),
		maths: req.param('maths'),
		science: req.param('science'),
		english: req.param('english'),
		social_sciences: req.param('social_sciences')
	}, function( error, docs) {
		res.redirect('/')
	});
});

// List of Students
app.get('/student/list', function(req, res) {
	studentProvider.findAll(function(error, student_collection) {
		//res.send(student_collection);
		res.render('list_students.jade', {
			locals: {
				students: student_collection
			}
		});
	});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
