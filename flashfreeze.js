var watcher = require('directory-tree-watcher');

var flashfreeze = {};

flashfreeze.start = function(folder) {

	console.log(folder);

	// TODO check folder is a git repo 

	flashfreeze.watch(folder, function(evt, file) {
		return console.log("watcher:", evt, file);
	});

	// Must be a better way to hang around than this?
	// Note that SIGINT doesn't work on Windows
	var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);
	rl.setPrompt('Running...');
	rl.prompt();

	rl.on('close', function() {
		console.log('Closing...');
		process.exit(0);
	});
};

flashfreeze.watch = function(folder, callback) {
	watcher(folder, callback);
};

flashfreeze.start(process.argv[2]);

module.exports = flashfreeze;