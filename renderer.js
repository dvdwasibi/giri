'use strict';

const spawn = require( 'child_process' ).spawn;
const Vue = require('./node_modules/vue/dist/vue.js');
const jiri = require('./jiri_util.js');
const git = require('./git_util.js');
const platform = require('os').platform;
const terminalConfig = require('./terminal_config.js').config;
const exec = require('child_process').exec;


var shell = require('electron').shell;

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
      var app, args, cmdline, runDirectly, setWorkingDirectory, surpressDirArg;
      app = terminalConfig.app.default;
      args = terminalConfig.args.default;
      setWorkingDirectory = terminalConfig.setWorkingDirectory.default;
      surpressDirArg = terminalConfig.surpressDirectoryArgument.default;
      runDirectly = terminalConfig.MacWinRunDirectly.default;
      cmdline = "\"" + app + "\" " + args;
      if (!surpressDirArg) {
        cmdline += " \"" + path + "\"";
      }
      if (platform() === "darwin" && !runDirectly) {
        cmdline = "open -a " + cmdline;
      }
      if (platform() === "win32" && !runDirectly) {
        cmdline = "start \"\" " + cmdline;
      }
      console.log('here');
      console.log(app);
      if (setWorkingDirectory) {
        if (path != null) {
          return exec(cmdline, {
            cwd: path
          });
        }
      } else {
        if (path != null) {
          return exec(cmdline);
        }
      }
    }

  }
});
