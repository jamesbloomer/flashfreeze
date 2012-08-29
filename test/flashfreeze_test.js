var async = require('async'),
	assert = require('assert'),
	flashfreeze = require('../lib/flashfreeze.js'),
	Git = require('git-wrapper'),
	mocha = require('mocha'),
	sinon = require('sinon');

describe('flashfreeze', function() {
	beforeEach(function(){
		sinon.stub(console, 'log');
	});

	afterEach(function(){
		console.log.restore();
	});

	describe('#start()', function() {
		
		var clock;
		var git;

		beforeEach(function(){
			sinon.stub(process, 'chdir').returns();
			sinon.stub(flashfreeze, 'checkFolder').yields();
			sinon.stub(flashfreeze, 'commit');
			clock = sinon.useFakeTimers();
		});

		afterEach(function(){
			process.chdir.restore();
			flashfreeze.checkFolder.restore();
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

		describe('when successful', function() {

			var git;

			beforeEach(function(){
				git = new Git();
				sinon.stub(git, 'exec').yields();
				flashfreeze.git = git;
				flashfreeze.commit('FOLDER');
			});

			afterEach(function(){
				git.exec.restore();
				flashfreeze.git = null;
			});

			it('should call git exec 3 times', function(done) {
				assert(flashfreeze.git.exec.calledThrice);
				done();
			});

			it('should call git add -A first', function(done) {
				assert(flashfreeze.git.exec.getCall(0).calledWith('add', {A: true}));
				done();
			});

			it('should call git commit second', function(done) {
				assert(flashfreeze.git.exec.getCall(1).calledWith('commit', {m : '"commit by flashfreeze"'}, []));
				done();
			});

			it('should call git push third', function(done) {
				assert(flashfreeze.git.exec.getCall(2).calledWith('push',  ['origin', 'master']));
				done();
			});
		});

		describe('when errors', function() {

			var git;

			beforeEach(function(){
				sinon.stub(process, 'exit').returns();
				git = new Git();
				sinon.stub(git, 'exec').yields('ERROR');
				flashfreeze.git = git;
				flashfreeze.commit('FOLDER');
			});

			afterEach(function(){
				process.exit.restore();
				git.exec.restore();
				flashfreeze.git = null;
			});

			it('should exit the process', function(done) {
				assert(process.exit.calledOnce);
				done();
			});
		});
	});
});