// CommandLine / Terminal Utility Functions
'use strict';

const platform = require('os').platform;
const exec = require('child_process').exec;

const getTerminalApp = function() {
  switch(platform()) {
    case 'darwin':
      return 'Terminal.app';
    case 'win32':
      return 'C:\\Windows\\System32\\cmd.exe';
    default:
      return '/usr/bin/x-terminal-emulator';
  }
}

module.exports.open = function(path) {
  const app = getTerminalApp();
  var cmdline = "\"" + app + "\" " + " \"" + path + "\"";
  if (platform() === "darwin") {
    cmdline = "open -a " + cmdline;
  }
  if (platform() === "win32") {
    cmdline = "start \"\" " + cmdline;
  }
  if (path != null) {
    return exec(cmdline, {
      cwd: path
    });
  } else {
    return exec(cmdline);
  }
}
