import babel from 'gulp-babel';
import del from 'del';
import gulp from 'gulp';
import uglify from 'gulp-uglify';

const dirs = {
  src: 'lib/**/*.js',
  dest: 'dist',
};

function clean() {
  return del(dirs.dest);
}
function build(done) {
  gulp
    .src(dirs.src)
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(dirs.dest));
  done();
}

gulp.task('build', gulp.series([clean, build]));

gulp.task('default', gulp.series(['build']));
