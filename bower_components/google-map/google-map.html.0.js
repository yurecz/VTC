
  (function() {

    Polymer({

      /**
       * A Google Maps marker object.
       *
       * @property marker
       * @type google.maps.Marker
       * @default null
       */
      marker: null,

      /**
       * The Google map object.
       *
       * @property map
       * @type google.maps.Map
       * @default null
       */
      map: null,

      /**
       * A Google Map Infowindow object.
       *
       * @property info
       * @type google.map.InfoWindow
       * @default null
       */
      info: null,

      /**
       * When true, marker *click events are automatically registered.
       *
       * @attribute clickEvents
       * @type boolean
       * @default false
       */
      clickEvents: false,

      /**
       * Image URL for the marker icon.
       *
       * @attribute icon
       * @type string|google.maps.Icon|google.maps.Symbol
       * @default null
       */
      icon: null,

      /**
       * When true, marker mouse* events are automatically registered.
       *
       * @attribute mouseEvents
       * @type boolean
       * @default false
       */
      mouseEvents: false,

      publish: {
        /**
         * The marker's longitude coordinate.
         *
         * @attribute longitude
         * @type number
         * @default null
         */
        longitude: {value: null, reflect: true},

        /**
         * The marker's latitude coordinate.
         *
         * @attribute latitude
         * @type number
         * @default null
         */
        latitude: {value: null, reflect: true}
      },

      observe: {
        latitude: 'updatePosition',
        longitude: 'updatePosition',
      },

      detached: function() {
        this.marker.setMap(null);
      },

      attached: function() {
        // If element is added back to DOM, put it back on the map.
        if (this.marker) {
          this.marker.setMap(this.map);
        }
      },

      updatePosition: function() {
        if (this.marker && this.latitude != null && this.longitude != null) {
          this.marker.setPosition({
            lat: parseFloat(this.latitude),
            lng: parseFloat(this.longitude)
          });
        }
      },

      clickEventsChanged: function() {
        if (this.map) {
          if (this.clickEvents) {
            this._forwardEvent('click');
            this._forwardEvent('dblclick');
            this._forwardEvent('rightclick');
          } else {
            this._clearListener('click');
            this._clearListener('dblclick');
            this._clearListener('rightclick');
          }
        }
      },

      mouseEventsChanged: function() {
        if (this.map) {
          if (this.mouseEvents) {
            this._forwardEvent('mousedown');
            this._forwardEvent('mousemove');
            this._forwardEvent('mouseout');
            this._forwardEvent('mouseover');
            this._forwardEvent('mouseup');
          } else {
            this._clearListener('mousedown');
            this._clearListener('mousemove');
            this._clearListener('mouseout');
            this._clearListener('mouseover');
            this._clearListener('mouseup');
          }
        }
      },

      iconChanged: function() {
        if (this.marker) {
          this.marker.setIcon(this.icon);
        }
      },

      mapChanged: function() {
        // Marker will be rebuilt, so disconnect existing one from old map and listeners.
        if (this.marker) {
          this.marker.setMap(null);
          google.maps.event.clearInstanceListeners(this.marker);
        }

        if (this.map && this.map instanceof google.maps.Map) {
          this.mapReady();
        }
      },

      contentChanged: function() {
        this.onMutation(this, this.contentChanged); // Watch for future updates.

        var content = this.innerHTML.trim();
        if (content) {
          if (!this.info) {
            // Create a new infowindow
            this.info = new google.maps.InfoWindow();
            this.infoHandler_ = google.maps.event.addListener(this.marker, 'click', function() {
              this.info.open(this.map, this.marker);
            }.bind(this));
          }
          this.info.setContent(content);
        } else {
          if (this.info) {
            // Destroy the existing infowindow.  It doesn't make sense to have an empty one.
            google.maps.event.removeListener(this.infoHandler_);
            this.info = null;
          }
        }
      },

      mapReady: function() {
        this._listeners = {};
        this.marker = new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(this.latitude, this.longitude),
          title: this.title,
          draggable: this.draggable,
          visible: !this.hidden,
          icon: this.icon
        });
        this.contentChanged();
        this.clickEventsChanged();
        this.contentChanged();
        this.mouseEventsChanged();
        setupDragHandler_.bind(this)();
      },

      _clearListener: function(name) {
        if (this._listeners[name]) {
          google.maps.event.removeListener(this._listeners[name]);
          this._listeners[name] = null;
        }
      },

      _forwardEvent: function(name) {
        this._listeners[name] = google.maps.event.addListener(this.marker, name, function(event) {
          this.fire('google-map-marker-' + name, event);
        }.bind(this));
      },

      attributeChanged: function(attrName, oldVal, newVal) {
        if (!this.marker) {
          return;
        }

        // Cannot use *Changed watchers for native properties.
        switch (attrName) {
          case 'hidden':
            this.marker.setVisible(!this.hidden);
            break;
          case 'draggable':
            this.marker.setDraggable(this.draggable);
            setupDragHandler_.bind(this)();
            break;
          case 'title':
            this.marker.setTitle(this.title);
            break;
        }
      }

    });

    function onDragEnd_(e, details, sender) {
      this.latitude = e.latLng.lat();
      this.longitude = e.latLng.lng();
    }

    function setupDragHandler_() {
      if (this.draggable) {
        this.dragHandler_ = google.maps.event.addListener(
            this.marker, 'dragend', onDragEnd_.bind(this));
      } else {
        google.maps.event.removeListener(this.dragHandler_);
        this.dragHandler_ = null;
      }
    }

  })();

