'use strict';
const spawn = require( 'child_process' ).spawn;
const Vue = require('./node_modules/vue/dist/vue.js');
const jiri = require('./jiri_util.js');
const git = require('./git_util.js');

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
    projects: []
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
        console.log(projectList);
      }).catch((error) => {
        console.log(error);
        console.log(error.stack);
      });
  },
});
