securipiserver
==============

Nodejs securipi server

Install make etc so mongodb bson can build c++ bson ext
  Stops getting this error:
  js-bson: Failed to load c++ bson extension, using pure JS version

sudo apt-get install gcc make build-essential

Install imagemagick (ext dependency)to stop the error:
events.js:72
        throw er; // Unhandled 'error' event
              ^
Error: spawn ENOENT
    at errnoException (child_process.js:1000:11)
    at Process.ChildProcess._handle.onexit (child_process.js:791:34)

sudo apt-get install imagemagick

sudo npm install -g grunt grunt-cli

npm install



if error /usr/bin/env: node: No such file or directory
Link node
which nodejs
sudo ln -s /usr/bin/nodejs /usr/bin/node
