'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var gulpNgConfig = require('gulp-ng-config');

gulp.task('angular-config', function(e) {

		//process.env.NODE_ENV
    gulp.src(path.join(conf.paths.src, '/config/angular-config.json'))
    .pipe(gulpNgConfig('app.config', {
        environment: 'development' 
    })).pipe(gulp.dest(path.join(conf.paths.src, '/app/')));

});


gulp.task('angular-config-build', function(e) {


    gulp.src(path.join(conf.paths.src, '/config/angular-config.json'))
    .pipe(gulpNgConfig('app.config', {
        environment: 'production'
    })).pipe(gulp.dest(path.join(conf.paths.src, '/app/')));


});