import gulp from 'gulp';
import consolidate from 'gulp-consolidate';
import config from '../../config';
import 'require-yaml';

gulp.task('list-pages', () => {
  delete require.cache[require.resolve(`../../../${config.src.pagelist}`)];
  let pages = require(`../../../${config.src.pagelist}`);
  return gulp
    .src(`${__dirname}/index.html`)
    .pipe(consolidate('lodash', {
      pages: pages
    }))
    .pipe(gulp.dest(config.dest.html));
});

gulp.task('list-pages:watch', () => gulp.watch(`${config.src.root}/*`, ['list-pages']));

