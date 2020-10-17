const path = require("path");
const appRoot = path.resolve(path.join(__dirname, "../../"));
const pathSeparator = appRoot.indexOf("\\") >= 0 ? "\\" : "/";

function convertToForwardSlash(pathh) {
  return pathh.replace(/\\/g, "/");
}

function hasTrailingSlash(string) {
  return string.charAt(string.length - 1) == pathSeparator;
}

function stripAppRoot(pathh) {
  return pathh.substr(appRoot.length);
}

module.exports.appRoot = appRoot;
module.exports.pathSeparator = pathSeparator;
module.exports.stripAppRoot = stripAppRoot;
module.exports.convertToForwardSlash = convertToForwardSlash;
module.exports.hasTrailingSlash = hasTrailingSlash;

module.exports.appendDir = function(pathh, dirName) {
  if (hasTrailingSlash(pathh)) return path.resolve(pathh + dirName);
  else return path.resolve(pathh + pathSeparator + dirName);
};

module.exports.getDirName = function(pathh) {
  return pathh.substring(pathh.lastIndexOf(pathSeparator) + 1, pathh.length);
};

module.exports.stripTrailingSlash = function(string) {
  if (string.charAt(string.length - 1) == pathSeparator)
    return string.substring(0, string.length - 1);
  else return string;
};

module.exports.convertToSystemSlash = function(pathh) {
  // Convert file path to have either \ or / depending on the OS
  if (pathSeparator == "/") {
    return pathh.replace(/\\/g, "/");
  } else if (pathSeparator == "\\") {
    return pathh.replace(/\//g, "\\");
  }
};

module.exports.getRelativePathFromFullPath = function(fullFilePath) {
  return convertToForwardSlash(stripAppRoot(fullFilePath));
};
