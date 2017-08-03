const chalk = require('chalk');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const glob = require('glob');
const path = require('path-extra');
const fs = require('fs-extra');

const logHelper = require('./log-helper');

// Print info about the project that is having it's bundles built
const rootOfRepo = path.join(__dirname, '..');
const currentBuildDirectory = process.cwd();
logHelper.log(`Building test bundles in ` +
  chalk.bgCyan(path.relative(rootOfRepo, currentBuildDirectory)));

// Get the paths of the bundle directory and the planned output directory
const bundleDirectory = path.join(currentBuildDirectory, 'test', 'bundle');
const bundleBuildDirectory = path.join(currentBuildDirectory, 'test', 'bundle-build');

logHelper.log(`    Deleting previous bundle builds.`);
fs.removeSync(bundleBuildDirectory);

// Find all the files that need to be bundled for testing
const bundleFiles = glob.sync(
  path.join(bundleDirectory, '**', '*.js'),
  {
    absolute: true
  }
);

const buildBundle = (inputFilePath, outputFilePath, nodeEnv) => {
  const plugins = [
    // Resolve allows bundled tests to pull in node modules like chai.
    resolve(),
    // CommonJS allows the loaded modules to work as ES2015 imports.
    commonjs(),
  ];

  if (nodeEnv) {
    outputFilePath = path.fileNameWithPostfix(outputFilePath, `.${nodeEnv}`);

    // Replace allows us to input NODE_ENV and strip code accordingly
    plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    }));
  }

  return rollup.rollup({
      entry: inputFilePath,
      plugins,
    })
    .then((bundle) => {
      return bundle.write({
        dest: outputFilePath,
        format: 'iife',
        sourceMap: 'inline',
      });
    });
};

// Run each test file through Rollup
return bundleFiles.reduce((promiseChain, bundleFile) => {
  return promiseChain.then(() => {
    logHelper.log(`    Building ` +
      chalk.bgCyan(path.relative(currentBuildDirectory, bundleFile)));

    const outputFilePath = bundleFile.replace(
        bundleDirectory,
        bundleBuildDirectory);

    logHelper.log(`        NODE_ENV 'undefined'`);
    return buildBundle(bundleFile, outputFilePath)
    .then(() => {
      logHelper.log(`        NODE_ENV 'production'`);
      buildBundle(bundleFile, outputFilePath, 'production')
    })
    .catch((err) => {
      console.log('\n');
      logHelper.log(chalk.red(`    Unable to build test bundle `) +
        chalk.bgRed(path.relative(rootOfRepo, bundleFile)));
      console.log('\n');
      console.error(err);
      console.log('\n');
      process.exit(1);
    });
  });
}, Promise.resolve());
