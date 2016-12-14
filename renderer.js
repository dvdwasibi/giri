'use strict';
const spawn = require( 'child_process' ).spawn;
const Vue = require('./node_modules/vue/dist/vue.js');
const jiri = require('./jiri_util.js');

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
    jiri.getProjects()
      .then((projectList) => {
        this.projects = projectList;
      }, (error) => {
        // TODO(dvdwasibi): Handle Error Case
        console.log(error);
      });
  },


});
