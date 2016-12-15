const platform = require('os').platform;

if (platform() === 'darwin') {
  module.exports.config = {
    app: {
      type: 'string',
      "default": 'Terminal.app'
    },
    args: {
      type: 'string',
      "default": ''
    },
    surpressDirectoryArgument: {
      type: 'boolean',
      "default": false
    },
    setWorkingDirectory: {
      type: 'boolean',
      "default": true
    },
    MacWinRunDirectly: {
      type: 'boolean',
      "default": false
    }
  };
} else if (platform() === 'win32') {
  module.exports.config = {
    app: {
      type: 'string',
      "default": 'C:\\Windows\\System32\\cmd.exe'
    },
    args: {
      type: 'string',
      "default": ''
    },
    surpressDirectoryArgument: {
      type: 'boolean',
      "default": false
    },
    setWorkingDirectory: {
      type: 'boolean',
      "default": true
    },
    MacWinRunDirectly: {
      type: 'boolean',
      "default": false
    }
  };
} else {
  module.exports.config = {
    app: {
      type: 'string',
      "default": '/usr/bin/x-terminal-emulator'
    },
    args: {
      type: 'string',
      "default": ''
    },
    surpressDirectoryArgument: {
      type: 'boolean',
      "default": false
    },
    setWorkingDirectory: {
      type: 'boolean',
      "default": true
    },
    MacWinRunDirectly: {
      type: 'boolean',
      "default": false
    }
  };
}
