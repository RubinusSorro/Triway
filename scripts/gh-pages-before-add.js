const fs = require('node:fs');
const path = require('node:path');

module.exports = function removePublishIgnoreFile(git) {
  fs.rmSync(path.join(git.cwd, '.gitignore'), { force: true });
  return git.exec('add', '-f', '.');
};
