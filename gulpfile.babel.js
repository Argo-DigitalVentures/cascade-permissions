import '@babel/register';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';
import gulp from 'gulp';
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify-es';

const dirs = {
  src: 'lib/**/*.js',
  dest: 'dist',
};

const tsProject = ts.createProject('tsconfig.json');
function clean() {
  return del(dirs.dest);
}
function build(done) {
  gulp
    .src(dirs.src)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dirs.dest));
  done();
}

gulp.task('build', gulp.series([clean, build]));
gulp.task('default', gulp.series('build'));
