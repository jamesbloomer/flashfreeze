var async = require('async'),
	Git = require('git-wrapper');

var flashfreeze = {};

flashfreeze.git = {};

flashfreeze.start = function(folder, interval) {

	console.log('will commit folder ' + folder + ' every ' + interval + ' minutes');

	// TODO folder here has to be full path or relative to where flashfreeze is running

	try {
		process.chdir(folder);
	} catch (chdirerr) {
		console.log('Not a valid directory');
		process.exit(0);
	}

	flashfreeze.git = new Git(); // { 'git-dir': folder + '/.git' }
	flashfreeze.checkFolder(folder, function(err) {
		if(err) {
			process.exit(0);
		}

		setInterval(flashfreeze.commit, interval * 60 * 1000);

	});
};

flashfreeze.checkFolder = function(folder, done) {
	flashfreeze.git.exec('status', done);
};

flashfreeze.commit = function(folder) {
	console.log('commit');

	async.series([
		function(callback){
			console.log('git add -A');
			flashfreeze.git.exec('add', {A : true}, [], callback);
		},
		function(callback){
			console.log('git commit');
			flashfreeze.git.exec('commit', {m : '"commit by flashfreeze"'}, [], callback);
		},
		function(callback){
			console.log('git push origin master');
			flashfreeze.git.exec('push',  ['origin', 'master'], callback);
		}
	],
	function(err, results){
		if(err) {
			console.log(err);
			return process.exit(0);
		}
	});
};

module.exports = flashfreeze;