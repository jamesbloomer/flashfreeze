var async = require('async'),
	Git = require('git-wrapper');

var flashfreeze = {};

flashfreeze.git = {};

flashfreeze.start = function(folder, interval) {

	console.log('will commit folder ' + folder + ' every ' + interval + ' minutes');

	// TODO check folder is valid
	// TODO folder here has to be full path or relative to where flashfreeze is running
	flashfreeze.git = new Git({ 'git-dir': folder });

	setInterval(flashfreeze.commit, interval * 60 * 1000);
};

flashfreeze.commit = function(folder) {
	console.log('commit');

	async.series([
		function(callback){
			console.log('git add -A');
			flashfreeze.git.exec('add', {A : true}, callback);
		},
		function(callback){
			console.log('git commit');
			flashfreeze.git.exec('commit', {m : true}, ['commit by flashfreeze'], callback);
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