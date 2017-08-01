var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'topicimages'
    },
    port: process.env.PORT || 3002,
    db: 'mongodb://localhost/topicimages-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'topicimages'
    },
    port: process.env.PORT || 3002,
    db: 'mongodb://localhost/topicimages-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'topicimages'
    },
    port: process.env.PORT || 3002,
    db: 'mongodb://localhost/topicimages-production'
  }
};

module.exports = config[env];
