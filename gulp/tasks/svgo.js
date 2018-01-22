import gulp from 'gulp';
import svgmin from 'gulp-svgmin';
import inject from 'gulp-inject';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';
import del from 'del';
import config from '../config';

gulp.task('svgo', () => {
  const target = gulp.src(`${config.src.templates}/partials/_svg-template.pug`);
  const source = gulp.src(`${config.src.svgMin}/**/*.svg`)
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}));

  const fileContents = (filePath, file) => file.contents.toString();

  return target
    .pipe(inject(source, {empty: true}))
    .pipe(inject(source, {transform: fileContents}))
    .pipe(gulp.dest(config.src.templates + '/partials'));
});

gulp.task('svgmin', () => {

  del(`${config.src.svgMin}/**/*.svg`).then(() => {
    return gulp.src(`${config.src.svgSource}/**/*.svg`)
      .pipe(svgmin({
        js2svg: {
          pretty: true
        },
        plugins: [{
          removeDesc: true
        },
        {
          removeComments: true
        },
        {
          moveElemsAttrsToGroup: true
        },
        {
          minifyStyles: true
        },
        {
          collapseGroups: true
        },
        {
          removeDesc: true
        },
        {
          removeUnknownsAndDefaults: true
        },
        {
          removeUselessStrokeAndFill: true
        },
        {
          transformsWithOnePath: true
        },
        {
          removeRasterImages: true
        },
        {
          cleanupIDs: true
        },
        {
          mergePaths: true
        }]
      }))
      .pipe(gulp.dest(`${config.src.svgMin}`));
  }
  );
});

gulp.task('svgo:watch', () => gulp.watch(`${config.src.svgMin}/**/*.svg`, ['svgo']));
gulp.task('svgmin:watch', () => gulp.watch(`${config.src.svgSource}/**/*.svg`, ['svgmin']));

