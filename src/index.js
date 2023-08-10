import fs from 'fs';
import _ from 'lodash';
import path from 'path';

const genDiff = (filename1, filename2) => {
    const fixturePath = path.join(process.cwd(), '__fixtures__');
    const filepath1 = path.join(fixturePath, filename1);
    const filepath2 = path.join(fixturePath, filename2);
    const file1 = fs.readFileSync(filepath1, 'utf-8');
    const file2 = fs.readFileSync(filepath2, 'utf-8');
    const obj1 = JSON.parse(file1);
    const obj2 = JSON.parse(file2);
    const keys = _.union(_.keys(obj1), _.keys(obj2)).sort();
    const result = keys.map((key) => {
        if (!_.has(obj1, key)) {
            return `  + ${key}: ${obj2[key]}`;
        } else if (!_.has(obj2, key)) {
            return `  - ${key}: ${obj1[key]}`;
        } else if (_.isEqual(obj1[key], obj2[key])) {
            return `    ${key}: ${obj1[key]}`;
        } else {
            return `  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`;
        }
    });
    return `{\n${result.join('\n')}\n}`;
};

export default genDiff;