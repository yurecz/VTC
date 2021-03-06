
    (function() {
      var doc = document.currentScript.ownerDocument,
          loader = {
        callbacks: [],
        load: function(path) {
          if(typeof window.ymaps !== 'undefined') {
            this.state = 'FINISHED';
          } else {
            this.loadScript(path)
          }
        },
        loadScript: function(path) {
          var el = doc.createElement("script");
          el.onload = this._onLoad.bind(this);
          el.async = true;
          el.src = path;
          doc.head.appendChild(el);
          this.state = 'LOADING';
        },
        state: 'IDLE',
        _onLoad: function() {
          this.state = 'FINISHED';
          this.callbacks.forEach(function(callback) {
            callback();
          });
        },
        onLoad: function(callback) {
          if(this.state === 'FINISHED') {
            callback();
          } else {
            this.callbacks.push(callback)
          }
        }
      };
      Polymer({
        created: function() {
          if(loader.state === 'IDLE') {
            var API_URL = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";			  
//            var API_URL = "http://api-maps.yandex.ru/2.1/?lang=en_US";
//            var API_URL = "http://api-maps.yandex.ru/2.1/?lang=ru_RU&mode=debug";
            loader.load(API_URL);
          }
          loader.onLoad(this.onReady.bind(this))
        },

        onReady: function() {
          ymaps.ready(function() {
            this.fire('ready');
          }, this);
        }
      })
    })();
  