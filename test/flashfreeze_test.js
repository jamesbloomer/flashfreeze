var async = require('async'),
	assert = require('assert'),
	child_process = require('child_process'),
	flashfreeze = require('../lib/flashfreeze.js'),
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
			sinon.stub(flashfreeze, 'commit');
			clock = sinon.useFakeTimers();
		});

		afterEach(function(){
			flashfreeze.commit.restore();
			clock.restore();
		});

		describe('with a valid folder', function() {

			beforeEach(function(){
				sinon.stub(process, 'chdir').returns();
				sinon.stub(flashfreeze, 'checkFolder').yields();
				flashfreeze.start('FOLDER', 1);
			});

			afterEach(function(){
				process.chdir.restore();
				flashfreeze.checkFolder.restore();
			});

			it('should call commit once timer has elapsed', function(done) {
				clock.tick(60 * 1000);
				assert(flashfreeze.commit.calledOnce);
				done();
			});

			it('should change directory to folder', function(done) {
				assert(process.chdir.calledOnce);
				assert(process.chdir.calledWith('FOLDER'));
				done();
			});
		});

		describe('with an invalid folder', function() {

			beforeEach(function(){
				sinon.stub(process, 'chdir').throws('ERROR');
				sinon.stub(flashfreeze, 'checkFolder').yields();
				sinon.stub(process, 'exit').returns();
				flashfreeze.start('FOLDER', 1);
			});

			afterEach(function(){
				process.chdir.restore();
				flashfreeze.checkFolder.restore();
				process.exit.restore();
			});

			it('should exit process', function() {
				assert(process.exit.calledOnce);
			});
		});

		describe('with a folder that is not a git directory', function() {

			beforeEach(function(){
				sinon.stub(process, 'chdir').returns();
				sinon.stub(flashfreeze, 'checkFolder').yields('ERROR');
				sinon.stub(process, 'exit').returns();
				flashfreeze.start('FOLDER', 1);
			});

			afterEach(function(){
				process.chdir.restore();
				flashfreeze.checkFolder.restore();
				process.exit.restore();
			});

			it('should exit process', function() {
				assert(process.exit.calledOnce);
			});
		});
	});

	describe('#checkFolder()', function() {
		describe('with a folder that is a git directory', function() {
			beforeEach(function() {
				sinon.stub(child_process, 'exec').yields();
			});

			afterEach(function() {
				child_process.exec.restore();
			});

			it('should not throw', function(done) {
				flashfreeze.checkFolder('GITFOLDER', function(err) {
					assert(!err);
					done();
				});
			});
		});

		describe('with a folder that is not a git directory', function() {
			beforeEach(function() {
				sinon.stub(child_process, 'exec').yields('ERROR');
			});

			afterEach(function() {
				child_process.exec.restore();
			});

			it('should throw an error', function() {
				flashfreeze.checkFolder('NOTAGITFOLDER', function(err) {
					assert.equal(err, 'ERROR');
				});
			});
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

	describe('#didCommitFailBecauseThereIsNothingToCommit()', function() {

		it('when there is nothing to commit should return true', function() {
			assert(flashfreeze.didCommitFailBecauseThereIsNothingToCommit('nothing to commit'));
		});

		it('when there is something to commit should return false', function() {
			assert(!flashfreeze.didCommitFailBecauseThereIsNothingToCommit('Error'));
		});
	});
});