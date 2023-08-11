import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const genDiff = (filename1, filename2) => {
  const filepath1 = path.isAbsolute(filename1) ? filename1 : path.join(process.cwd(), '__fixtures__', filename1);
  const filepath2 = path.isAbsolute(filename2) ? filename2 : path.join(process.cwd(), '__fixtures__', filename2);

  const file1 = fs.readFileSync(filepath1, 'utf-8');
  const file2 = fs.readFileSync(filepath2, 'utf-8');
  const obj1 = JSON.parse(file1);
  const obj2 = JSON.parse(file2);

  const keys = _.union(_.keys(obj1), _.keys(obj2)).sort();

  const result = keys.map((key) => {
    if (!_.has(obj1, key)) {
      return `  + ${key}: ${obj2[key]}`;
    } if (!_.has(obj2, key)) {
      return `  - ${key}: ${obj1[key]}`;
    } if (_.isEqual(obj1[key], obj2[key])) {
      return `    ${key}: ${obj1[key]}`;
    }
    return `  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`;
  });

  return `{\n${result.join('\n')}\n}`;
};

export default genDiff;
