import gulp from 'gulp';
import runSequence from 'run-sequence';
import config from '../config';

const build = (cb, build=false) => {
  if(build) {
    runSequence(
      'clean',
      'svgo',
      'sass',
      'pug',
      'webpack',
      'copy',
      'critical',
      'list-pages',
      cb);
  }
  else{
    runSequence(
      'clean',
      'svgo',
      'sass',
      'pug',
      'webpack',
      'copy',
      'list-pages',
      cb);
  }
};

gulp.task('build', (cb) => {
  config.setEnv('production');
  config.logEnv();
  build(cb, true);
});

gulp.task('build:dev', (cb) => {
  config.setEnv('development');
  config.logEnv();
  build(cb);
});
