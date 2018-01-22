import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import mqpacker from 'css-mqpacker';
import cssvariables from 'postcss-css-variables';
import config from '../config';
import cssnano from 'cssnano';

const processors = [
  autoprefixer({
    browsers: ['last 4 versions', 'IE 11'],
    cascade: false
  }),
  cssvariables({
    preserve: true
  }),
  mqpacker({
      sort: function (a, b) {
          a = a.replace(/\D/g,'');
          b = b.replace(/\D/g,'');
          return b-a;
          // replace this with a-b for Mobile First approach
      }
  }),
  cssnano({
    // minifyFontValues: false,
    // discardUnused: false
  }),
];

gulp.task('sass', () => {
  return gulp
    .src(`${config.src.sass}/*.{sass,scss}`)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: config.production ? 'compact' : 'expanded', // nested, expanded, compact, compressed
      precision: 5
    }))
    .on('error', config.errorHandler)
    .pipe(postcss(processors))
  // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest.css));
});

gulp.task('sass:watch', () => {
  gulp.watch(`${config.src.sass}/**/*.{sass,scss}`, ['sass']);
});
