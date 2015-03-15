
    Polymer({
      /**
       * A latitude of marker
       *
       * @attribute latitude
       * @type Number
       */
      latitude: 0,

      /**
       * A longitude of marker
       *
       * @attribute longitude
       * @type Number
       */
      longitude: 0,

      /**
       * Content which should be shown inside marker
       *
       * @attribute iconContent
       * @type String
       */
      iconContent: '',


      iconContentChanged: function(oldVal, newVal) {
        if(this.placemark) {
          this.placemark.properties.set('iconContent', newVal);
        }
      },

      createMarker: function() {
        this.placemark = new ymaps.Placemark([this.latitude, this.longitude]);
        this.mapCtrl.addMarker(this.placemark);
        this.placemark.properties.set('iconContent', this.iconContent);
      },
      detached: function() {
        this.mapCtrl.removeMarker(this.placemark);
      }
    });
  