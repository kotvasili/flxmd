import gulp from 'gulp';
import webpack from 'webpack';
import gutil from 'gulp-util';
import notify from 'gulp-notify';
import server from './server';
import config from '../config';
import webpackConfig from '../../webpack.config';

const handler = (err, stats, cb) => {
  let errors = stats.compilation.errors;

  if (err) throw new gutil.PluginError('webpack', err);

  if (errors.length > 0) {
    notify.onError({
      title: 'Webpack Error',
      message: '<%= error.message %>',
      sound: 'Submarine'
    }).call(null, errors[0]);
  }

  gutil.log('[webpack]', stats.toString({
    colors: true,
    chunks: false
  }));

  server.reload();
  if (typeof cb === 'function') cb();
};

gulp.task('webpack', function(cb) {
  webpack(webpackConfig(config.env)).run((err, stats) => {
    handler(err, stats, cb);
  });
});
gulp.task('webpack:build', function(cb) {
  config.env = 'production';
  webpack(webpackConfig(config.env)).run((err, stats) => {
    handler(err, stats, cb);
  });
});
gulp.task('webpack:watch', function() {
  webpack(webpackConfig(config.env)).watch({
    aggregateTimeout: 100,
    poll: false
  }, handler);
});
