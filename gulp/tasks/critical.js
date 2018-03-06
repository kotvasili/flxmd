import gulp from 'gulp';
import config from '../config';
// import critical from 'critical';
var critical = require('critical').stream;
import gutil from 'gulp-util';

gulp.task('critical', function(){ return gulp.src([config.dest.html + "/*.html"])
  .pipe(critical({
    base: config.dest.html,
    inline: true,
    minify: true,
    ignore: ['@font-face', 'content', 'font-family', 'clearfix'],
	ignoreOptions: {
		matchSelectors: true,
		matchTypes: true,
		matchDeclarationProperties: false,
		matchDeclarationValues: false,
		matchMedia: false
	},
    css: [config.dest.css + '/app.css'],
  }))
  .pipe(gulp.dest(config.dest.html +''))
 });


gulp.task('critical:watch', () => {
  gulp.watch(`${config.dest.html}/**/*.html`, ['critical']);
});

