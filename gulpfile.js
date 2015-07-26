// Variables
var gulp       = require('gulp'),
	jade       = require('jade'),
	gulpJade   = require('gulp-jade'),
	sourcemaps = require('gulp-sourcemaps'),
	minifyCss  = require('gulp-minify-css'),
	rename     = require('gulp-rename'),
	compass    = require('gulp-compass'),
	zip        = require('gulp-zip'),
	notify     = require('gulp-notify'),
	jadephp    = require('jade-php'),
	plumber    = require('gulp-plumber'),
	path       = require('path')

// Icone pour les notifications Gulp
var notifyInfo = {
	title: 'Gulp',
	icon: path.join(__dirname, 'gulp.png')
};

// Paramétre pour la configuration de Plumber
var plumberErrorHandler = { errorHandler: notify.onError({
		title: notifyInfo.title,
		icon: notifyInfo.icon,
		message: "Error: <%= error.message %>"
	})
};
// Compilation du SASS en CSS
gulp.task('compass_sass', function() {
	return gulp.src('assets/sass/*.sass')
		.pipe(plumber(plumberErrorHandler))
		.pipe(compass({
			css: 'assets/css',
			sass: 'assets/sass',
			image: 'assets/img'}))
		.pipe(rename({ suffix: '.min'}))
    	.pipe(minifyCss())
		.pipe(notify({ message: 'Tâche SASS & MinifyCss  faite.' }))
		.pipe(gulp.dest('assets/css'))
});

// Compilation du JADE en HTML
gulp.task('jade', function() {
  var YOUR_LOCALS = {};

  	return gulp.src('jade/**/*.jade')
	    .pipe(gulpJade({
			jade: jade,
			pretty: true,
			expand: true
	    }))
	    .pipe(gulp.dest('.'))
	    .pipe(notify({ message: 'Tâche JADE faite.' }))
});

// Minification du css en .min.css
gulp.task('minify-css', function() {
  return gulp.src('assets/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(minifyCss())
    .pipe(gulp.dest('assets/css/'));
});

// Tâche de distribution
gulp.task('dist', ['compass', 'jade'],function(){
});

// Tâche par défault
gulp.task('default', ['dist'], function(){
	gulp.src('*')
		.pipe(zip('archive.zip'))
		.pipe(gulp.dest('.'));
});

// Tâche qui permet de lancer toute les tâches
gulp.task('watch', function(){
	gulp.watch('assets/sass/**/*.sass', ['compass_sass']);
	gulp.watch('jade/**/*.jade'       , ['jade']);
	gulp.watch('assets/css/*.css'     , ['minify-css']);
})
