var assert = require('assert'),
	flashfreeze = require('../flashfreeze.js'),
	mocha = require('mocha'),
	watcher = require('directory-tree-watcher'),
	sinon = require('sinon');

describe('flashfreeze', function() {
	describe('#start()', function() {

		beforeEach(function(){
			sinon.stub(flashfreeze, 'watch').yields('EVENT', 'FILE');
		});

		afterEach(function(){
			flashfreeze.watch.restore();
		});

		it('should start watching the folder passed in', function(done) {
			flashfreeze.start('FOLDER', function() {
				// TODO need to stop the readline
				assert(flashfreeze.watch.calledOnce());
				done();	
			});
		});
	});
});