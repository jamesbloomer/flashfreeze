var program = require('commander');

var flashfreeze = {};

flashfreeze.start = function(folder, interval) {

	console.log('will commit folder ' + folder + ' every ' + interval + ' minutes');

	// TODO check folder is valid

	setInterval(flashfreeze.commit, interval * 60 * 1000);
};

flashfreeze.commit = function(folder) {
	// TODO do the commit
	console.log('commit');
};

program
  .version('0.0.1')
  .option('-f, --folder <folder>', 'Folder to commit')
  .option('-i, --interval <interval>', 'Interval at which to commit in minutes [15]', Number, 15)
  .parse(process.argv);

module.exports = flashfreeze;