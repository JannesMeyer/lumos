import * as path from 'path';
import * as fs from 'q-io/fs';
import { SegmentedPath } from './SegmentedPath';
import config from '../config';

/**
 * A class that represents a directory
 */
export class Directory {

  

  constructor(path) {
    this.path = path;
    // this.dirs = [SegmentedPath, ...]
    // this.files = [SegmentedPath, ...]
  }

  readContents() {
    var contents;
    return fs.readdirAsync(this.path.absolute)
    .then(names => {
      contents = names.map(name => new SegmentedPath(this.path.absolute, [name]));
      // Find out whether these are directories or files
      var promises = contents.map(item => fs.statAsync(item.absolute));
      return Promise.all(promises);
    })
    .then(stats => {
      // TODO: use for..of instead
      // Correct isDir information
      contents.forEach(function(item, i) {
        item.isDir = stats[i].isDirectory();
        if (item.isDir) {
          item.link = encodeURIComponent(item.name) + '/';
        } else {
          item.makeFile();
          item.link = encodeURIComponent(item.name);
        }
      });

      // sort
      contents.sort(itemSort);
      contents = contents.filter(itemFilterFn);

      // split
      for (var i = 0; i < contents.length; ++i) {
        if (!contents[i].isDir) {
          break;
        }
      }
      this.dirs = contents.slice(0, i);
      this.files = contents.slice(i);

      return this;
    });
  }

  hasFile(name) {
    for (var i = 0; i < this.files.length; ++i) {
      var file = this.files[i];
      if (file.fullName === name) {
        return true;
      }
    }
    return false;
  }

  removeFile(name) {
    for(var i = 0; i < this.files.length; ++i) {
      if (this.files[i].fullName === name) {
        break;
      }
    }
    this.files.splice(i, 1);
  }
}

/**
 * Sort function for Directory objects
 */
function itemSort(a, b) {
  // Arrange directories on top
  if (a.isDir && !b.isDir) { return -1; }
  if (!a.isDir && b.isDir) { return 1; }

  // And sort by name
  // TODO: use Intl.Collator
  return a.sortStr.localeCompare(b.sortStr, undefined, { numeric: true });
}

/**
 * Filter function for SegmentedPath objects
 */
function itemFilterFn(item) {
  if (item.isHidden) { return false; }
  if (!item.isDir) {
    // if (item.fullName === config.indexFile) { return false; }
    if (item.extension !== config.mdSuffix) { return false; }
  }
  return true;
}