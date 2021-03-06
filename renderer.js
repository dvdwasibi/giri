'use strict';

const spawn = require( 'child_process' ).spawn;
const Vue = require('./node_modules/vue/dist/vue.js');
const jiri = require('./util/jiri_util.js');
const git = require('./util/git_util.js');
const terminal = require('./util/terminal_util.js');
const shell = require('electron').shell;

new Vue({

  el: '#jiri-update',

  data: {
    isUpdating: false,
    isSuccessfulUpdate: false,
    isFailedUpdated: false,
    updateStatus: '',
    updateError: '',
  },

  ready: function() {},

  methods: {
    // Runs a Jiri Update command and updates the UI accordingly
    handleJiriUpdate: function() {
      // Update state
      this.isUpdating = true;
      this.isSuccessfulUpdate = false;
      this.isFailedUpdate = false;
      this.updateStatus = '';
      this.updateError = '';

      var ls = spawn( 'cd $FUCHSIA_WORKSPACE && jiri update', {shell: true});

      ls.stdout.on( 'data', data => {
        this.updateStatus += data + '\n';
      });

      ls.stderr.on( 'data', data => {
        this.isUpdating = false;
        this.isFailedUpdate = true
        this.updateError = data;
      });

      ls.on( 'close', code => {
        this.isUpdating = false;
        this.isSuccessfulUpdate = true;
      });
    }
  }
});


new Vue({
  el: '#jiri-projects',

  data: {
    projects: [],
    hasUpdatedSyncStatus: false,
  },

  ready: function() {
    // Retrieve projects from cache(if it exists)
    var cachedProjects = window.localStorage.getItem('projects');
    if(cachedProjects) {
      this.projects = JSON.parse(cachedProjects);
    }

    // Use Jiri to get the most recent project info
    jiri.getProjects()
      .then((projectList) => {
        window.localStorage.setItem('projects', JSON.stringify(projectList));
        this.projects = projectList;
        return jiri.getMasterSyncStatus(projectList);
      }).then((projectList) => {
        this.projects = projectList;
        this.hasUpdatedSyncStatus = true;
      }).catch((error) => {
        //TODO(dvdwasibi): Error Handling
      });
  },

  methods: {
    openRemoteUrl: function(url, event) {
      event.preventDefault();
      shell.openExternal(this.href);
    },
    openPathInTerminal: function(path) {
      terminal.open(path);
    }
  }
});
