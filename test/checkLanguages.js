const fs = require('fs');
const path = require('path');
const jsonlint = require('jsonlint');
const jsonDiff = require('json-diff');

const JsonTest = {
  baseFile: 'en.json',
  files: [],

  addFile(file) {
    JsonTest.files.push(file);
  },

  compareKeys(baseLan, otherLang) {
    return jsonDiff.diff(
      JSON.parse(baseLan.content),
      JSON.parse(otherLang.content),
      { keysOnly: true }
    );
  },

  lint(content) {
    jsonlint.parse(content);
  },

  async getFiles() {
    return new Promise((resolve) => {
      fs.readdir(
        path.resolve(__dirname, '../src/assets/i18n'),
        (err, filenames) => {
          if (err) {
            return;
          }
          resolve(filenames);
        }
      );
    });
  },

  async readFile(file) {
    return new Promise(async (resolve) => {
      fs.readFile(
        path.resolve(__dirname, '../src/assets/i18n/' + file),
        'utf-8',
        (err, content) => {
          if (err) {
            return;
          }
          resolve(content);
        }
      );
    });
  },

  async lintFiles() {
    const files = await JsonTest.getFiles();

    await Promise.all(
      files.map(async (file) => {
        try {
          const content = await JsonTest.readFile(file);
          JsonTest.addFile({ name: file, content });
          JsonTest.lint(content);
          console.info(`lint is good ${file}`);

          return true;
        } catch (error) {
          // debug
          // console.log('file ', file);
          throw error;
        }
      })
    );
  },

  validateFile() {
    const baseFile = JsonTest.files.find((w) => w.name === JsonTest.baseFile);
    const filesToCompare = JsonTest.files.filter(
      (w) => w.name !== JsonTest.baseFile
    );
    const result = filesToCompare.map((w) => JsonTest.compareKeys(baseFile, w));
    return result.filter((w) => w !== undefined);
  },

  async init() {
    await JsonTest.lintFiles();
    const result = JsonTest.validateFile();

    if (result.length > 0) {
      throw new Error(JSON.stringify(result));
    }

    console.info('Languages are good :)');
  },
};
JsonTest.init();

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  debugger; // eslint-disable-line no-debugger

  process.exit(-1); // eslint-disable-line no-process-exit
});
