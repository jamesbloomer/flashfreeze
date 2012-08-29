var async = require('async'),
	Git = require('git-wrapper'),
	winston = require('winston');

var flashfreeze = {};

flashfreeze.git = {};

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { colorize: true, timestamp: true });

flashfreeze.start = function(folder, interval) {

	winston.info('will commit folder ' + folder + ' every ' + interval + ' minutes');

	// TODO folder here has to be full path or relative to where flashfreeze is running

	try {
		process.chdir(folder);
	} catch (chdirerr) {
		winston.error('Not a valid directory');
		process.exit(0);
	}

	flashfreeze.git = new Git(); // { 'git-dir': folder + '/.git' }
	flashfreeze.checkFolder(folder, function(err) {
		if(err) {
			winston.error('Not a valid directory');
			process.exit(0);
		}

		setInterval(flashfreeze.commit, interval * 60 * 1000);

	});
};

flashfreeze.checkFolder = function(folder, done) {
	flashfreeze.git.exec('status', done);
};

flashfreeze.commit = function(folder) {
	winston.info('committing changes...');

	async.series([
		function(callback){
			flashfreeze.git.exec('add', {A : true}, [], callback);
		},
		function(callback){
			flashfreeze.git.exec('commit', {m : '"commit by flashfreeze"'}, [], callback);
		},
		function(callback){
			flashfreeze.git.exec('push',  ['origin', 'master'], callback);
		}
	],
	function(err, results){
		if(err) {
			winston.error('error committing changes');
		}

		winston.info('...finished committing changes');
	});
};

module.exports = flashfreeze;