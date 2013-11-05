
describe('Yandex Metrica', function () {

  var Yandex = require('analytics/lib/integrations/yandex-metrica');
  var assert = require('assert');
  var sinon = require('sinon');
  var test = require('integration-tester');
  var when = require('when');

  var yandex;
  var settings = {
    counterId: 22522351
  };

  beforeEach(function () {
    yandex = new Yandex(settings);
  });

  afterEach(function () {
    yandex.reset();
    window['yaCounter' + settings.counterId] = undefined;
  });

  it('should have the right settings', function () {
    test(yandex)
      .name('Yandex Metrica')
      .assumesPageview()
      .readyOnInitialize()
      .global('yandex_metrika_callbacks')
      .global('Ya')
      .option('counterId', null);
    });

  describe('#initialize', function () {
    beforeEach(function () {
      yandex.load = sinon.spy(yandex, 'load');
    });

    it('should push onto the yandex_metrica_callbacks', function () {
      assert(!window.yandex_metrika_callbacks);
      yandex.initialize();
      assert(window.yandex_metrika_callbacks.length === 1);
    });

    it('should create a yaCounter object', function (done) {
      var id = yandex.options.counterId;
      yandex.initialize();
      when(function () { return window['yaCounter' + id]; }, done);
    });

    it('should call #load', function () {
      yandex.initialize();
      assert(yandex.load.called);
    });
  });

  describe('#load', function () {
    it('should create the window.Ya.Metrika variable', function (done) {
      yandex.load();
      when(function () { return window.Ya && window.Ya.Metrika; }, done);
    });

    it('should callback', function (done) {
      yandex.load(done);
    });
  });

});
