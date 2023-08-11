import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import genDiff from '../src/index.js';

const getFixturesPath = (filename) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, '..', '__fixtures__', filename);
};

const normalizeSpaces = (str) => str.replace(/\s+/g, ' ').trim();

const testFileComparison = (file1Name, file2Name, expectedFileName) => {
  const filepath1 = getFixturesPath(file1Name);
  const filepath2 = getFixturesPath(file2Name);
  const readFixture = (filename) => fs.readFileSync(getFixturesPath(filename), 'utf-8');
  const expected = readFixture(expectedFileName);

  const received = genDiff(filepath1, filepath2);

  const normalizedExpected = normalizeSpaces(expected);
  const normalizedReceived = normalizeSpaces(received);

  expect(normalizedReceived).toBe(normalizedExpected);
};

/* eslint jest/expect-expect:
["error", { "assertFunctionNames": ["expect", "testFileComparison"] }] */
test('Compares two JSON files and returns the difference', () => {
  testFileComparison('file1.json', 'file2.json', 'expected1.txt');
});

/* eslint jest/expect-expect:
["error", { "assertFunctionNames": ["expect", "testFileComparison"] }] */
test('Compares two YAML files and returns the difference', () => {
  testFileComparison('file1.yml', 'file2.yaml', 'expected1.txt');
});

test('Comparing files of different formats throws an error', () => {
  const filepath1 = getFixturesPath('file1.json');
  const filepath2 = getFixturesPath('file2.yaml');

  expect(() => {
    genDiff(filepath1, filepath2);
  }).toThrow(/Error: Different input file formats/);
});

/* eslint jest/expect-expect:
["error", { "assertFunctionNames": ["expect", "testFileComparison"] }] */
test('should return empty string if both files are empty', () => {
  testFileComparison('empty1.json', 'empty2.json', 'empty.txt');
});
