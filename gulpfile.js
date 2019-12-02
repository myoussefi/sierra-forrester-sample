const {src, dest, watch, parallel} = require('gulp');
const ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

function defaultTask() {
  return build();
}

function copy(cb) {
  return src('src/*.html')
    .pipe(dest('dist/'))
    .on('end', cb);
}

function tsc(cb) {
  const tsResult = src('src/**/*.ts')
    .pipe(tsProject());
  return tsResult.js.pipe(dest('dist'))
    .on('end', cb);
}

function watchSource() {
  return watch(['src/*.*'], function(cb) {
    return parallel(copy, tsc)(cb);
  });
}

exports.default = defaultTask;
exports.copy = copy;
exports.watch = watchSource;
exports.build = parallel(copy, tsc);
exports.tsc = tsc;