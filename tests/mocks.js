module.exports = function(dialog) {
  dialog.showOpenDialog = () => {
    return ['/Users/brittanystoroz/github/turing/firesale-demo/tests/fixture-files/hi.md'];
  };
};