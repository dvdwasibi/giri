// Git Utility Functions

'use strict';
const spawn = require( 'child_process' ).spawn;

module.exports.getLocalHeadSHA = function(path) {
  return new Promise((resolve, reject) => {
    console.log(`cd ${path} && git rev-parse HEAD `);
    var ls = spawn( `cd ${path} && git rev-parse HEAD `, {shell: true});

    ls.stderr.on( 'data', code => {
      reject(code);
    });

    ls.stdout.on( 'data', data => {
      resolve(`${data}`);
    });
  });
}

module.exports.getRemoteHeadSHA = function(path) {
  return new Promise((resolve, reject) => {
    var ls = spawn( `cd ${path} && git rev-parse origin/master `, {shell: true});

    ls.stderr.on( 'data', code => {
      reject(code);
    });

    ls.stdout.on( 'data', data => {
      resolve(`${data}`);
    });
  });
}
