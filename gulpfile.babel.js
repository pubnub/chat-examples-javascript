import eslint from 'gulp-eslint';
import shell from 'gulp-shell';
import gulp from 'gulp';

const handleResults = (results) => {
  let errorMessage = null;

  if (results.warningCount) {
    errorMessage = `Too much warnings (${results.warningCount})`;
  } else if (results.errorCount) {
    errorMessage = `Too much warnings (${results.warningCount})`;
  }

  if (errorMessage !== null) {
    throw errorMessage;
  }
};

const ignoreNodeModules = !process.env.CI ? { ignorePattern: '**/node_modules/*' } : {};

gulp.task('lint_examples', () => gulp.src(['examples/**/*.js'])
  .pipe(eslint(ignoreNodeModules))
  .pipe(eslint.format())
  .pipe(eslint.results(handleResults))
  .pipe(eslint.failAfterError()));
gulp.task('lint_snippets', () => gulp.src(['snippets/**/*.js'])
  .pipe(eslint(ignoreNodeModules))
  .pipe(eslint.format())
  .pipe(eslint.results(handleResults))
  .pipe(eslint.failAfterError()));

gulp.task('examples_tests', shell.task('npm run test-examples'));
gulp.task('snippets_tests', shell.task('npm run test-snippets'));

gulp.task('examples_full_test', gulp.series('lint_examples', 'examples_tests'));
gulp.task('snippets_full_test', gulp.series('lint_snippets', 'snippets_tests'));

gulp.task('lint_all', gulp.series('lint_examples', 'lint_snippets'));
gulp.task('test_all', shell.task('npm run test'));
gulp.task('full_test', gulp.series('lint_all', 'test_all'));
