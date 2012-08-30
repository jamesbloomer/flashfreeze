var async = require('async'),
	child_process = require('child_process'),
	winston = require('winston');

var flashfreeze = {};

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

	flashfreeze.checkFolder(folder, function(err) {
		if(err) {
			winston.error('Not a valid directory');
			process.exit(0);
		}

		setInterval(flashfreeze.commit, interval * 60 * 1000);

	});
};

flashfreeze.checkFolder = function(folder, done) {
	child_process.exec('git status', done);
};

var didCommitFailBecauseThereIsNothingToCommit = function(stdout) {
	return stdout.indexOf('nothing to commit') != -1;
};

flashfreeze.commit = function(folder) {
	winston.info('committing changes...');

	async.series([
		function(callback){
			child_process.exec('git add -A', callback);
		},
		function(callback){
			child_process.exec('git commit -m "commit by flashfreeze"', function(error, stdout, stderr) {
				if(error) {
					if(!didCommitFailBecauseThereIsNothingToCommit(stdout)) {
						winston.error(stdout);
						winston.error(stderr);
						callback(error);
					}
				}

				callback();
			});
		},
		function(callback){
			child_process.exec('git push origin master', callback);
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