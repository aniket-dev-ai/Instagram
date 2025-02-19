const DatauriParser = require('datauri/parser');
const path = require('path');

const parser = new DatauriParser();

const dataUri = (file) => {
  if (!file || !file.originalname || !file.buffer) {
    throw new Error('Invalid file object');
  }
  return parser.format(path.extname(file.originalname).toString(), file.buffer).content;
}

module.exports = dataUri;
