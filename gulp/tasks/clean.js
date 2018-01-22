import gulp from 'gulp';
import del from 'del';
import util from 'gulp-util';
import config from '../config';

gulp.task('clean', (cb) => {
  return del([
    config.dest.root
  ]).then(function(paths) {
    util.log('Deleted:', util.colors.magenta(paths.join('\n')));
  });
});
