var Q = require('q');

var root_indexer = require(__base + 'services/indexing/indexer.es/Indexer.js');
var winston = require(__base + 'services/CustomWinston');
var eventEmitter = require(__base + 'services/CustomEventEmitter');

/** listened events **/
var GEOCODE_OK = 'geocode_ok';

/** fired events **/

function ConcertIndexer (client) {
  this.type = 'concert';
  this.es_client = client;
}

ConcertIndexer.prototype = new root_indexer.I();

ConcertIndexer.prototype.init = function () {
  var self = this;
  winston.info('init Concert.indexer');
	
	eventEmitter.on(GEOCODE_OK, function(crawledModule) {
    winston.info ('publishing concert for ' + crawledModule.bandName + ' ' + crawledModule.location);
		self.publish(crawledModule);
	});
}

ConcertIndexer.prototype.exists = function (data) {
  return this.es_client.search ({
    index: this.index,
    body: {
      query: {
        bool: {
          must: [
            { match: { 'bandName.exact' : data.bandName }},
            { match: { 'date': data.date }}
          ]
        }
      }
    }
  })
    .then (function (body) {
      var deferred = Q.defer();
      var results = body.hits.total;
      
      if (results === 0)
        deferred.reject (Error (results));
      else
        deferred.resolve ();

      return deferred.promise;
    });
}

module.exports = {
    indexer: ConcertIndexer
};
