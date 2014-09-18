var should = require('should'); 
var assert = require('assert');
var dynamodb = require("vogels");
var PUIDCreator = require("../src/node/dynamodbTables/PUID-creator");

describe('puid-transform', function() {
	var count1 = (36);
	var count2 = (36 * 36);
	var count3 = (36 * 36) + (36 * 15) + 14;
	var puid1;
	var puid2;
	var puid3;
	before(function(done){
		var puidGen = new PUIDCreator(dynamodb);
		puid1 = puidGen.transform(count1);
		puid2 = puidGen.transform(count2);
		puid3 = puidGen.transform(count3);
		done();
	});

	it('should have converted count to puid', function() {
		puid1.should.equal('A0000000010');
		puid2.should.equal('A0000000100');
		puid3.should.equal('A00000001FE');
	});
});