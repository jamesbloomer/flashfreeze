var async = require('async'),
	assert = require('assert'),
	flashfreeze = require('../lib/flashfreeze.js'),
	Git = require('git-wrapper'),
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

	describe('#commit()', function() {

		var git;

		beforeEach(function(){
			git = new Git();
			sinon.stub(git, 'exec').yields();
			flashfreeze.git = git;
		});

		afterEach(function(){
			git.exec.restore();
			flashfreeze.git = null;
		});

		it('should call git add -A', function(done) {
			flashfreeze.commit('FOLDER');
			assert(flashfreeze.git.exec.calledThrice);
			assert(flashfreeze.git.exec.getCall(0).calledWith('add', {A: true}));
			done();
		});
	});
});