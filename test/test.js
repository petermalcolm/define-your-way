// Some Chai:
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
// use all three available syntaxes:
const expect = chai.expect;
const assert = chai.assert;
chai.should();

// A DB for users, games and cached API responses
const levelup = require('level');
const dbNoPromise = levelup('../define-db');

// Some node magic for making Promises:
const {promisify} = require('util');
const db = { get : promisify(dbNoPromise.get.bind(dbNoPromise)),
			 put : promisify(dbNoPromise.put.bind(dbNoPromise)),
			 del : promisify(dbNoPromise.del.bind(dbNoPromise)) };

// Code to Test:
const userlib = require('../server-side/users.js');
const users = new userlib(db);
const gamelib = require('../server-side/games.js');
const games = new gamelib(db); 

// and a password that is not on github:
try {
    var testCreds = require('./_test-creds.js');
} catch (e) {
    if (e.code == 'MODULE_NOT_FOUND') {
    	console.log('Oh no!  You need credentials for test users.');
    	console.log('Just create a file called: \n');
    	console.log('_test-creds.js\n');
    	console.log('in the test/ directory (next to test.js).');
    	console.log('In case your feeling lazy, use this as the content of that file:\n');
    	console.log('module.exports = \''+Math.random().toString(36).substring(2)+'\';\n');
    	console.log('That password was just created randomly, just for you.  Feel free to change it.');
        process.exit();
    }
} 

///////////////////
//   THE TESTS   //
///////////////////

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(4).should.equal(-1);
    });
  });
});

describe("Users Mechanisms", function() {
	describe("Try to Create a Duplicate User", function() {
		it('should not insert a user to the db that already exists', function() {
		expect( users.create({	name : 'John Doe',
								email : 'johndoe@example.com',
								password : testCreds,
								avatar : 'http://example.com/avatar.png'
							}) ).to.eventually.be.an('error');
		});
	});

	describe("Delete a User", function() {
		it('should delete a user, given the email address', function() {
			// TODO: real code here ...
		});
	});

	describe("Create a Brand New User", function() {
		it('should insert a user to the db that does not exist yet', function() {
		expect( users.create({	name : 'John Doe',
								email : 'johndoe@example.com',
								password : testCreds,
								avatar : 'http://example.com/avatar.png'
							}) ).to.eventually.be.a('string');
		});
	});

	describe("Authenticate a User", function() {
			// TODO: real code here ...
	});
});