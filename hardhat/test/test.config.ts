import path from 'path';
import {ethers} from 'hardhat';
import {expect, assert} from 'chai';

declare const global: any;

global.srcDir = path.resolve(path.join(__dirname, '../contracts') );
global.ethers = ethers;
global.expect = expect;
global.assert = assert;

beforeEach(async () => {
});

afterEach(async () => {
});

process.on('unhandledRejection', (reason, p) => {

  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
  debugger; // eslint-disable-line no-debugger

  process.exit(-1); // eslint-disable-line no-process-exit
});
