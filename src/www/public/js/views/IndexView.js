
define([
  'jquery',
  'underscore',
  'backbone',
  'text!/pages/mainTemplate.html',
  'views/concert_marker_view'
], function($, _, Backbone, mainTemplate, ConcertMarkerView){
  
  var MainView = Backbone.View.extend({
    el:  '#container',
    
    initialize: function (options) {
      
      //Navigation Menu Slider

      _.bindAll(this, 'render', '_initialize_map', '_onReset', '_onLocationUpdated', '_onConcertsRetrieved');
      options.vent.bind('resetMap', this._onReset);
      options.vent.bind('updateLocation', this._onLocationUpdated);
      options.vent.bind('concertsRetrieved', this._onConcertsRetrieved);
    },

    render: function () {
			var that = this;
      $(this.el).html(mainTemplate);
      
      that.map_container = {};
      that.location_marker = null;
      that.markers = [];
      that.showsCircle = null;

      that._initialize_map ();
		},
    
    _initialize_map : function() {
      var center = new google.maps.LatLng(43.580417999999995,7.125102);
      var styles = [
        {
          elementType: "geometry",
          stylers: [
            { lightness: 10 },
            { saturation: 0 }
          ]
        }
      ];

      var mapOptions = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: center,
        styles: styles,
        streetViewControl: false,
        mapTypeControl: false,
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        }

      };
      this.map_container = new google.maps.Map(document.getElementById('map-container'),
                                               mapOptions);
    },

    _onLocationUpdated : function(area){
      var image = {
        url: 'img/target-icon.png',
        // This marker is 20 pixels wide by 32 pixels tall.
        size: new google.maps.Size(32, 32),
        // The origin for this image is 0,0.
        origin: new google.maps.Point(0,0),
        // The anchor for this image is the base of the flagpole at 0,32.
        anchor: new google.maps.Point(16, 16)
      };

      this.location_marker = new google.maps.Marker({
        'map': this.map_container,
        'position': area.location,
        'icon': image
      });

      var regex = /\d+/;
      var match = area.radius.match(regex);

      var radius = 100;
      if (match) {
        radius = match[0];
      }

      var options = {
        strokeColor: '#0000FF',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#0000AA',
        fillOpacity: 0.05,
        map: this.map_container,
        center: area.location,
        radius: radius * 1000
      };
      this.showsCircle = new google.maps.Circle(options);

      this.map_container.setCenter(this.location_marker.position);
    },

    _onReset: function() {
      console.log('IndexView resetting ...');
      
      console.log(this.location_marker);
      if (this.location_marker != null)
        this.location_marker.setMap(null);

      this.location_marker = null;

      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].remove();
      }
      this.markers = [];

      if (this.showsCircle != null) {
        this.showsCircle.setMap (null);
      }

    },

    _onConcertsRetrieved: function (data) {
      var self = this;
      
      var concerts = data.concerts;
      concerts.forEach (function (concert) {

        var marker = new ConcertMarkerView({
          model: concert,
          query: data.query,
          map: self.map_container 
        });

        self.markers.push(marker);
      });
    },

	});
  return MainView;

});
