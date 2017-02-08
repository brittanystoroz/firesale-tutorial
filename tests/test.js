let Application = require('spectron').Application
let expect = require('chai').expect;
let assert = require('chai').assert;
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

let electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
let appPath = path.join(__dirname, '..');
let mocksPath = path.join(__dirname, 'mocks.js');

global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});

describe('App starts and has correct title and buttons', function () {
  let app = null
  before(function () {
      app = new Application({ 
        path: electronPath,
        env: { SPECTRON: '1' },
        args: [appPath, '-r', mocksPath]
      });
      return app.start();
  });

  after(function (done) {
      done();
      return app.stop();
  });

  it('opens a window', function () {
    return app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(1);
  });

  it('tests the title', function () {
    return app.client.waitUntilWindowLoaded().getTitle()
            .should.eventually.equal('Fire Sale');
  });
  it('tests the Open File button text is not disabled', function () {
    return app.client.waitUntilWindowLoaded().getText('#open-file')
            .should.eventually.equal('Open File')
  })

  it('tests the Save button text is disabled', function () {
    return app.client.getText('#save-markdown')
            .should.eventually.equal('Save Markdown')
  })

  it('tests the Open button opens a file dialog', function (done) {
    app.client.click('#open-file').then((dialog) => { 
      return app.client.getText('.raw-markdown').then(text => {
        text.should.equal('# hi');
        done();
      })
    }).catch((error) => {
      done(error);
    });
  });
});