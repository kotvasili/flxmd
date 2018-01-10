import gulp from 'gulp';
import config from '../config';

gulp.task('watch',
  ['copy:watch',
    'svgmin:watch',
    'svgo:watch',
    'pug:watch',
    'list-pages:watch',
    'webpack:watch',
    'sass:watch'
  ]);
