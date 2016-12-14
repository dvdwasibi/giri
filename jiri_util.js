// Jiri Utility Functions

'use strict';
const spawn = require( 'child_process' ).spawn;

// Get List of Projects
module.exports.getProjects = function() {
  return new Promise((resolve, reject) => {
    var projectList = [];
    var ls = spawn( 'cd $FUCHSIA_WORKSPACE && jiri project list', {shell: true});

    // parse each line of the project info output from Jiri
    ls.stdout.on( 'data', data => {
      // Split into Lines
      var projectLines = `${data}`.split('\n');
      projectLines.forEach((projectLine) => {
        var projectAttributes = projectLine.split(' ');
        if(projectAttributes.length === 3) {
          var project = {};
          projectAttributes.forEach((attributeLine) => {
            var kv = attributeLine.split('=');
            if(kv.length == 2) {
              project[kv[0]] = kv[1].substring(1,kv[1].length-1);
            }
          });
          projectList.push(project);
        }
      });
    });

    ls.stderr.on( 'data', code => {
      reject(code);
    })

    ls.on( 'close', code => {
      resolve(projectList);
    });
  });
}
