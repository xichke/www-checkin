const {
	src,
	dest,
	series,
	task,
	parallel
} = require('gulp'),
	_ = require('lodash'),
	imagemin = require('gulp-imagemin'),
	uglify = require('gulp-uglify'),
	cache = require('gulp-cached'),
	useref = require('gulp-useref'),
	run = require('gulp-run'),
	gulpif = require('gulp-if'),
	minifyCss = require('gulp-clean-css'),
	replace = require('gulp-replace'),
	rev = require('gulp-rev'),
	clean = require('gulp-clean');

task('img', (done) => {
	src('../assets/photos/**')
		.pipe(imagemin([
			imagemin.mozjpeg({
				quality: 60,
				progressive: true
			}),
			imagemin.optipng({
				optimizationLevel: 5
			})
		]))
		.pipe(dest('../assets/photos'))
		.on('end', done);
});

task('bundle', (done) => {
	src(`_includes/assets.src.html`)
		.pipe(cache('useref'))
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(dest('.'))
		.on('end', done);
});

task('clean:before', () => {
	return src([`assets/**/dist*.*`])
		.pipe(clean());
});

task('clear:after', () => {
	return run('mv assets/assets.src.html _includes/assets.html').exec();
});

task('dev', () => {
	return run('cp _includes/assets.src.html _includes/assets.html;').exec();
});

task('dist', series('clean:before', 'img', 'bundle', 'clear:after', (done) => {
	done();
}));