var program = require('commander'),
	flashfreeze = require('./lib/flashfreeze.js');

program
  .version('0.0.1')
  .option('-f, --folder <folder>', 'Folder to commit')
  .option('-i, --interval <interval>', 'Interval at which to commit in minutes [15]', Number, 15)
  .parse(process.argv);

// Can commander do this for free?
if(!program.folder) {
	console.log('Must provide a folder');
	process.exit(0);
}

flashfreeze.start(program.folder, program.interval);
