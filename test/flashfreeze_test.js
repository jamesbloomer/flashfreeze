var async = require('async'),
	assert = require('assert'),
	child_process = require('child_process'),
	flashfreeze = require('../lib/flashfreeze.js'),
	Git = require('git-wrapper'),
	mocha = require('mocha'),
	sinon = require('sinon'),
	winston = require('winston');

describe('flashfreeze', function() {
	beforeEach(function(){
		sinon.stub(winston, 'error');
		sinon.stub(winston, 'info');
	});

	afterEach(function(){
		winston.error.restore();
		winston.info.restore();
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
				sinon.stub(child_process, 'exec').yields();
				flashfreeze.commit('FOLDER');
			});

			afterEach(function(){
				child_process.exec.restore();
			});

			it('should call child_process exec 3 times', function(done) {
				assert(child_process.exec.calledThrice);
				done();
			});

			it('should call git add -A first', function(done) {
				assert(child_process.exec.getCall(0).calledWith('git add -A'));
				done();
			});

			it('should call git commit second', function(done) {
				assert(child_process.exec.getCall(1).calledWith('git commit -m "commit by flashfreeze"'));
				done();
			});

			it('should call git push third', function(done) {
				assert(child_process.exec.getCall(2).calledWith('git push origin master'));
				done();
			});
		});

		describe('when errors', function() {

			beforeEach(function(){
				sinon.stub(process, 'exit').returns();
				sinon.stub(child_process, 'exec').yields('ERROR');
				flashfreeze.commit('FOLDER');
			});

			afterEach(function(){
				process.exit.restore();
				child_process.exec.restore();
			});

			it('should not exit the process', function(done) {
				assert(!process.exit.called);
				done();
			});
		});
	});
});