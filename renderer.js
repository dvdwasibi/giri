// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.



'use strict';
console.log('here');
const spawn = require( 'child_process' ).spawn;


var statusDiv = document.getElementById('status');
var statusTextDiv = document.getElementById('status-text');
var projectTable =  document.getElementById('project-table');
getProjects();

// get list of projects
function getProjects() {
  var projects = [];
  var ls = spawn( 'cd $FUCHSIA_WORKSPACE && jiri project list', {shell: true});

  ls.stdout.on( 'data', data => {
    // var projectInfo = parseProject(data);
    var projectBits = `${data}`;
    projectBits = projectBits.split('\n');
    for (var i =0; i<projectBits.length; i++) {
      projects.push(parseProject(projectBits[i]));
    }
  });

  ls.stderr.on( 'close', code => {
    if(code == 0) {
      for (var i=0; i<projects.length; i++) {
        var row = document.createElement('tr');
        row.innerHTML = '<td>' + projects[i].name + '</td><td>' +  projects[i].remote + '</td>'
        projectTable.appendChild(row)
      }
    }
  });
}

function parseProject(project) {
  console.log(project);
  var projectInfo = project.split(' ');
  var result = {};
  for (var i=0; i<projectInfo.length; i++) {
    var kv = projectInfo[i].split('=');
    if(kv.length == 2) {
      result[kv[0]] = kv[1].substring(1,kv[1].length-1);
    }
  }
  return result;
}

document.getElementById('jiri-update-button').addEventListener("click", function() {
  var ls = spawn( 'cd $FUCHSIA_WORKSPACE && jiri update', {shell: true});

  statusDiv.innerHTML = 'DOING WORK';

  ls.stdout.on( 'data', data => {
    console.log( `stdout: ${data}` );
    statusTextDiv.innerHTML += '<br/> ' + data;
  });

  ls.stderr.on( 'data', data => {
    console.log( `stderr: ${data}` );
  });

  ls.on( 'close', code => {
    console.log( `child process exited with code ${code}` );
    if(code == 0) {
      console.log('Done, like a boss!');
      statusDiv.innerHTML = 'UPDATE COMPLETE...LIKE A BOSS';
      statusTextDiv.innerHTML = '';
    }
  });
});
