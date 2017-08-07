var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'test';

var config = {
  development: {
    baseUrl: "/",
    root: rootPath,
    app: {
      name: 'topicimages'
    },
    port: process.env.PORT || 3002,
    db: 'mongodb://localhost/topicimages-development'
  },

  test: {
    baseUrl: "/",
    root: rootPath,
    app: {
      name: 'topicimages'
    },
    port: process.env.PORT || 3002,
    db: 'mongodb://localhost/topicimages-test'
  },

  production: {
    baseUrl: "/",
    root: rootPath,
    app: {
      name: 'topicimages'
    },
    port: process.env.PORT || 3002,
    db: 'mongodb://drendon9:puoOFR62@ds135963.mlab.com:35963/topicimages'
  }
};

module.exports = config[env];
