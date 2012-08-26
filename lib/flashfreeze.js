var program = require('commander'),
	Git = require('git-wrapper');

var flashfreeze = {};

flashfreeze.start = function(folder, interval) {

	console.log('will commit folder ' + folder + ' every ' + interval + ' minutes');

	// TODO check folder is valid

	setInterval(flashfreeze.commit, interval * 60 * 1000);
};

flashfreeze.commit = function(folder) {
	console.log('commit');
	
	// var git = new Git();

	// git.exec('add', {A : true}, function(err, msg) {
	// 	if (err) {
	// 		process.exit(0);
	// 	}

	// 	git.exec('commit', {m : true}, ['commit by flashfreeze'], function(err, msg) {
	// 		if (err) {
	// 			process.exit(0);
	// 		}

	// 		git.exec('push',  ['origin', 'master'], function(err, msg) {
	// 			if (err) {
	// 				process.exit(0);
	// 			}
	// 		});
	// 	});
	// });
};

module.exports = flashfreeze;