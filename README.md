# flashfreeze

A node.js version of Flashbake.

Background backup and version control for your files.

Designed for anyone working on files and wanting incremental backups eg. writers. Hopefully (eventually) usable by non-technical users.

Flashfreeze adds, commits and pushes the entire contents of a directory to git at a given interval.


## Install
```
npm install flash freeze
```

## Usage
```
	node flashfreeze -f [directory to backup] -i [interval in minutes]
```

## TODO

- Allow changing the commit message
- Install and setup guide for non-technical users
- Plugins


## LICENCE

(The MIT License)

Copyright (c) 2012 James Bloomer <https://github.com/jamesbloomer>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

