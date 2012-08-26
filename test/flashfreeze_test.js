var assert = require('assert'),
	flashfreeze = require('../lib/flashfreeze.js'),
	mocha = require('mocha'),
	sinon = require('sinon');

describe('flashfreeze', function() {
	describe('#start()', function() {
		var clock;

		beforeEach(function(){
			sinon.stub(flashfreeze, 'commit');
			clock = sinon.useFakeTimers();
		});

		afterEach(function(){
			flashfreeze.commit.restore();
			clock.restore();
		});

		it('should call commit once timer has elapsed', function(done) {
			flashfreeze.start('FOLDER', 1);
			clock.tick(60 * 1000);
			assert(flashfreeze.commit.calledOnce);
			done();
		});
	});
});