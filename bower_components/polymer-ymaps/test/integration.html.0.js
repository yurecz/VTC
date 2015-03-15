
  describe('yandex-map integration test', function() {
    function waitFor(test, callback) {
      function wait() {
        if(test()) {
          callback();
        } else {
          setTimeout(wait, 100)
        }
      }
      setTimeout(wait, 0);
    }
    beforeEach(function(done) {
      document.createElement('ymaps-api').addEventListener('ready', function () {
        done();
      });
    });

    it('should create map with two markers', function(done) {
      var map = document.getElementById('map'),
          markers;
      waitFor(function() {
        return markers = map.shadowRoot.querySelector('ymaps[class$="places-pane"]')
      }, function() {
        expect(markers.children.array()).to.have.length(2);
        done();
      });
    });
  });
