var assert = require('chai').assert;
var should = require('chai').should();

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