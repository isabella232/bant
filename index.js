
module.exports = {

  browserify: function (files, opts, cb) {
    require('./lib/browserify')(files, opts, cb);
  },

  component: function (component, opts, cb) {
    require('./lib/component')(component, opts, cb);
  }

};
