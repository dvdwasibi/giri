// Jiri Utility Functions

// 'use strict';
const spawn = require( 'child_process' ).spawn;
const git = require('./git_util.js');
var PromisePool = require('es6-promise-pool')

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

// Adds the sync(master or not for all projects)
module.exports.getMasterSyncStatus = function(projects) {


  function getProjectSyncStatus(path) {
    return new Promise((resolve, reject) => {
      Promise.all([
        git.getLocalHeadSHA(path),
        git.getRemoteHeadSHA(path)
      ]).then(values => {
        console.log(values);
        resolve(values[0] === values[1]);
      })
      .catch(reject);
    });
  }

  const generatePromises = function *() {
    for(var i = 0; i<projects.length; i++) {
      yield getProjectSyncStatus(projects[i].path);
    }
  }

  const promiseIterator = generatePromises()
  const pool = new PromisePool(promiseIterator, 5)

  return new Promise((resolve, reject) => {
    var updatedProjectList;
    const promiseIterator =
    pool.start().then(values => {
      var updatedProjectList = projects.map((project, index) => {
        console.log(values);
        return Object.assign({isSynced: values[index]}, project);
      });
      resolve(updatedProjectList);
    })
    .catch(reject);
  });
}
