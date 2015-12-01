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
      assert.equal(true, items.some(i => (i.name === 'Exposé einer Bachelorthesis')));
    });
  });
  
  it('can be used to create links relative to the base', () => {
    let dir = new Directory('/test/asd', baseDir);
    let file = new File('asdf.md', dir);
    
    assert.equal('/test/asd/', dir.relativeToFirstBase);
    assert.equal('/test/asd/asdf', file.relativeToFirstBase);
  });
  
});

describe('File', () => {
  
  let baseDir = new Directory('/Users/jannes/Dropbox/Notes/');
  
  it('initializes correctly', () => {
    let file = new File('index.md', baseDir);
    assert.equal(file.absolutePath, '/Users/jannes/Dropbox/Notes/index.md');
    assert.equal(file.name, 'index');
  });
  
  it('can read its contents, which should start with a #', () => {
    let file = new File('index.md', baseDir);
    return file.readContent().then(content => {
      assert.equal(typeof content, 'string');
      assert.equal(content[0], '#');
    });
  });
  
});