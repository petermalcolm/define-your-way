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
const dbNoPromise = levelup('./define-db');

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
	describe("Create a User", function() {
		it('should not insert a user to the db that already exists', function() {
			// TODO: real code here ...
			['foobar'].toString().should.equal(['foobar'].toString());
		});
		it('should insert a user to the db that does not exist yet', function() {
			// TODO: real code here ...
		});
	});

	describe("Authenticate a User", function() {
			// TODO: real code here ...
	});
});