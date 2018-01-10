import gulp from 'gulp';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import frontMatter from 'gulp-front-matter';
import cache from 'gulp-cached';
import prettify from 'gulp-prettify';
import pugbem from 'gulp-pugbem';
import config from '../config';

const renderHtml = (onlyChanged) => {
  return gulp
    .src([`${config.src.templates}/[^_]*.pug`])
    .pipe(plumber({errorHandler: config.errorHandler}))
    .pipe(frontMatter({property: 'data'}))
    .pipe(pug({
      plugins: [pugbem]
    }))
    .pipe(prettify({
      indent_size: 2,
      wrap_attributes: 'auto',
      preserve_newlines: true,
      end_with_newline: true
    }))
    .pipe(gulpif(onlyChanged, cache('pugging')))
    .pipe(gulp.dest(config.dest.html));
};

gulp.task('pug', () => renderHtml());
gulp.task('pug:changed', () => renderHtml(true));

gulp.task('pug:watch', () => {
  gulp.watch([`${config.src.templates}/**/_*.pug`], ['pug']);
  gulp.watch([`${config.src.templates}/**/[^_]*.pug`], ['pug:changed']);
});
