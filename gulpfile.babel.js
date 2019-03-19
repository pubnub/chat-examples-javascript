import eslint from 'gulp-eslint';
import shell from 'gulp-shell';
import gulp from 'gulp';


gulp.task('lint_examples', () => gulp.src(['examples/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));
gulp.task('lint_snippets', () => gulp.src(['snippets/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('examples_tests', shell.task('npm run test-examples'));
gulp.task('snippets_tests', shell.task('npm run test-snippets'));

gulp.task('examples_full_test', gulp.series('lint_examples', 'examples_tests'));
gulp.task('snippets_full_test', gulp.series('lint_snippets', 'snippets_tests'));

gulp.task('validate_all', gulp.series('lint_examples', 'lint_snippets'));
gulp.task('test_all', shell.task('npm run test'));
gulp.task('full_test', gulp.series('validate_all', 'test_all'));
