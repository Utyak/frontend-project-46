import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parseFile from './parsers.js';

const getFileType = (filepath) => {
  const extension = path.extname(filepath).toLowerCase();
  const fileType = extension.slice(1);
  return fileType === 'yml' ? 'yaml' : fileType;
};

const genDiff = (filename1, filename2) => {
  const preprocessFilepath = (filepath) => (path.isAbsolute(filepath) ? filepath : path.join(process.cwd(), '__fixtures__', filepath));

  const filepath1 = preprocessFilepath(filename1);
  const filepath2 = preprocessFilepath(filename2);

  const fileType1 = getFileType(filepath1);
  const fileType2 = getFileType(filepath2);

  if (fileType1 !== fileType2) {
    throw new Error('Error: Different input file formats');
  }

  const readFileContent = (filepath) => fs.readFileSync(filepath, 'utf-8');

  const fileContent1 = readFileContent(filepath1);
  const fileContent2 = readFileContent(filepath2);

  if (!fileContent1 || !fileContent2) {
    return '';
  }

  const obj1 = parseFile(fileContent1, fileType1);
  const obj2 = parseFile(fileContent2, fileType2);

  const keys = _.union(_.keys(obj1), _.keys(obj2)).sort();

  const result = keys.map((key) => {
    if (!_.has(obj1, key)) {
      return `  + ${key}: ${obj2[key]}`;
    }
    if (!_.has(obj2, key)) {
      return `  - ${key}: ${obj1[key]}`;
    }
    if (_.isEqual(obj1[key], obj2[key])) {
      return `    ${key}: ${obj1[key]}`;
    }
    return `  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`;
  });

  return `{\n${result.join('\n')}\n}`;
};

export default genDiff;
