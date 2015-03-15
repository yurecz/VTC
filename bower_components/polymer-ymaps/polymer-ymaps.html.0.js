
    (function () {
      if (!Array.from) {
        Array.from = function (object) {
          return [].slice.call(object);
        };
      }
      var stylesWatcher = {
        components: [],
        styles: "",
        initialize: function () {
          var observer = new MutationObserver(this.onMutate.bind(this));
          observer.observe(document.head, {childList: true});
        },
        onMutate: function (mutations) {
          var newStyles = mutations.reduce(function (total, mutation) {
            if (mutation.addedNodes.length > 0) {
              total += Array.from(mutation.addedNodes).filter(function (tag) {
                return tag.tagName && tag.tagName.toLowerCase() === 'style' && tag.textContent.match(/^.ymaps/)
              }).map(function(tag) {
                return tag.textContent;
              }).join('\n')+'\n';
            }
            return total;
          }, "");
          if(newStyles.length > 0) {
            this.components.forEach(function(component) {
              this.applyStyle(component, newStyles);
            }, this);
            this.styles += newStyles;
          }
        },
        applyStyle: function(component, style) {
          var tag = document.createElement('style');
          tag.textContent = style;
          component.shadowRoot.appendChild(tag);
        },
        register: function (component) {
          this.applyStyle(component, this.styles);
          this.components.push(component);
        }
      };
      stylesWatcher.initialize();

      Polymer('yandex-map', {

        /**
         * A latitude of the map center
         *
         * @attribute latitude
         * @type Number
         */
        latitude: 0,

        /**
         * A longitude of the map center
         *
         * @attribute longitude
         * @type Number
         */
        longitude: 0,

        /**
         * Zoom of the map
         *
         * @attribute zoom
         * @type Number
         */
        zoom: 8,

        /**
         * Array containing map markers
         * _Do not use it to add markers. Use element `yandex-map-marker` instead_
         * @attribute placemarks
         * @type Array
         */
        placemarks: [],

        /**
         * Set this to true if you want that map would be adjusted to show whole markers on it
         * @attribute autoFit
         * @type Boolean
         */
        autoFit: false,

        observe: {
          latitude: 'setPosition',
          longitude: 'setPosition',
          zoom: 'setPosition'
        },

        ready: function () {
          stylesWatcher.register(this);
          Array.from(this.$.markers.getDistributedNodes()).forEach(this.bindSelfToMarker, this);
          this.onMutation(this, this.onChangeContent);
        },

        createMap: function () {
          var map = this.map = new ymaps.Map(this.$.map, {
            center: [this.latitude, this.longitude],
            zoom: this.zoom
          });
          this.placemarks.forEach(function(placemark) {
            map.geoObjects.add(placemark)
          }, this);
          if(this.autoFit) {
            this.fitMarkers();
          }
          map.events.add('boundschange', function(event) {
            var center = event.get('newCenter');
            this.latitude = center[0];
            this.longitude = center[1];
            this.zoom = event.get('newZoom');
          }, this);
        },

        onChangeContent: function(observer, mutations) {
          mutations.forEach(function(mutation) {
            Array.from(mutation.addedNodes).forEach(function(node) {
              if(node.tagName && node.tagName.toLowerCase() === 'yandex-map-marker') {
                this.bindSelfToMarker(node);
              }
            }, this);
          }, this);
          this.onMutation(this, this.onChangeContent);
        },

        bindSelfToMarker: function(marker) {
          marker.mapCtrl = this;
        },

        setPosition: function() {
          if(this.map) {
            this.map.setCenter([this.latitude, this.longitude], this.zoom);
          }
        },

        fitMarkers: function() {
          this.job('fitMarkers', function() {
            if(this.map.geoObjects.getLength() > 0) {
              var bounds = this.map.geoObjects.getBounds();
              this.map.setBounds(bounds, {checkZoomRange: true});
            }
          }, 100);
        },

        addMarker: function (marker) {
          this.placemarks.push(marker);
          if(this.map) {
            this.map.geoObjects.add(marker);
            if(this.autoFit) {
              this.fitMarkers();
            }
          }
        },

        removeMarker: function(marker) {
          var index = this.placemarks.indexOf(marker);
          if(index > -1) {
            this.placemarks.splice(index, 1);
            if(this.map) {
              this.map.geoObjects.remove(marker);
              if(this.autoFit) {
                this.fitMarkers();
              }
            }
          }
        }
      });
    })();
  