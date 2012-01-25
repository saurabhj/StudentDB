var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

StudentProvider = function(host, port) {
  this.db= new Db('node-mongo-student', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

// getCollection
StudentProvider.prototype.getCollection= function(callback) {
	this.db.collection('students', function(error, student_collection) {
		if( error ) callback(error);
		else callback(null, student_collection);
	});
};

// findAll
StudentProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error, student_collection) {
		if( error ) callback(error)
		else {
			student_collection.find().toArray(function(error, results) {
				if( error ) callback(error)
				else callback(null, results)
			});
		}
	});
};

// findByRollNumber
StudentProvider.prototype.findByRollNumber = function(roll_number, callback) {
	this.getCollection(function(error, student_collection) {
		if(error) callback(error)
		else {
			student_collection.findOne({roll_number:roll_number}, function(error, result) {
				if(error) callback(error)
				else {
					callback(null, result);
				}
			});
		}
	});
}

// save
StudentProvider.prototype.save = function(students, callback) {
	this.getCollection(function(error, student_collection) {
		if( error ) callback(error)
		else {
			if( typeof(students.length)=="undefined") {
				students = [students];
			}

			for(var i=0; i<students.length; i++){
				var student = students[i];

				// Check if any of the students have the same roll number, then update them
				this.findByRollNumber(students[i].roll_number, function(error, st) {
					if(st.length)
				})
				
				student.created_at = new Date();
				student.total = Number(student.maths) + Number(student.science) + Number(student.social_sciences) + Number(student.english);
				student.percentage = Number((student.total / 4));
			}
			
			student_collection.insert(students, function() {
				callback(null, students);
			});
		}
	});
};

exports.StudentProvider = StudentProvider;