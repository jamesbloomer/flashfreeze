var async = require('async'),
	child_process = require('child_process'),
	fs = require('fs'),
	util = require('util'),
	winston = require('winston');

var flashfreeze = {};

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { colorize: true, timestamp: true });

flashfreeze.start = function(folder, interval) {

	winston.info('will commit folder ' + folder + ' every ' + interval + ' minutes');

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

flashfreeze.didCommitFailBecauseThereIsNothingToCommit = function(stdout) {
	return stdout.indexOf('nothing to commit') != -1;
};

flashfreeze.getStatus = function(done) {
	var status = 'commit by flashfreeze';
	fs.exists('status.txt', function(exists) {
		if(exists) {
			try {
				status = fs.readFileSync('status.txt', 'utf8');
			} catch(error) {
				winston.error('could not read status file, using "commit by flashfreeze" as commit message', { error: error });
			}
		}

		return done(status);
	});
};

flashfreeze.commit = function(folder) {
	winston.info('committing changes...');

	async.series([
		function(callback){
			child_process.exec('git add -A', callback);
		},
		function(callback){
			flashfreeze.getStatus(function(status) {
				var cmd = util.format('git commit -m "%s"', status);
				child_process.exec(cmd, function(error, stdout, stderr) {
					if(error) {
						if(!flashfreeze.didCommitFailBecauseThereIsNothingToCommit(stdout)) {
							winston.error(stdout);
							winston.error(stderr);
							callback(error);
						}
					}

					callback();
				});
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