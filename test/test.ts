import * as assert from 'assert';
import config from '../src/config';
import Directory from '../src/classes/Directory';
import File from '../src/classes/File';

describe('Directory', () => {
  
  let baseDir = new Directory('/Users/jannes/Dropbox/Notes/');
  
  it('initializes correctly', () => {
    let dir = new Directory('/', baseDir);
    assert.equal(dir.absolutePath, '/Users/jannes/Dropbox/Notes');
    assert.equal(dir.name, 'Notes');
    assert.equal(dir.normalizedName, 'notes');
  });
  
  it('does not allow escaping of the sandbox', () => {
    assert.throws(() => {
      new Directory('/..', baseDir);
    });
  });
  
  xit('allows moving up inside of the sandbox', () => {
    assert.doesNotThrow(() => {
      new Directory('/test/..', baseDir);
    });
  });
  
  it('can read its contents', () => {
    let dir = new Directory('/', baseDir);
    return dir.readContent().then(items => {
      assert.equal(true, items.every(i => (i instanceof Directory || i instanceof File)));
      assert.equal(true, items.some(i => (i.name === 'Exposé einer Bachelorthesis.md')));
    });
  });
  
});