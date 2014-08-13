/**
 * Searcher
 */

var config = require('app-config');
var Q = require('q');
var ElasticSearchClient = require('elasticsearchclient');
var Promise = require('es6-promise').Promise;
var winston = require ('winston');

var bandNameQuery = require('../queries/queries').bandNameQuery;
var allSylesQuery = require('../queries/queries').allSylesQuery;

var serverOptions = {
	host: config.es.hostname,
	port: config.es.port
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

exports.searchBandName = function (bandName) {
	return new Promise(function(resolve, reject) {
		
		console.log("search band name : " + bandName);
		
		var qryObj = bandNameQuery(bandName);
		
		elasticSearchClient.search(config.es.index, config.es.type, qryObj).
			on('data', function(data) {

        var json = JSON.parse(data);

        if (json.status === 404) {
          resolve([]);
        }
        else {
				  resolve(json.hits.hits);
        }
			})
			.on('error', function(err) {
				console.log(err);
				reject(err);
			})
			.exec();
		
	});
	
};

exports.getAllStyles = function() {
	console.log("get all styles");
	
	var deferred = Q.defer();
	winston.info(allSylesQuery);
	
	elasticSearchClient.search(config.es.index, config.es.type, allSylesQuery)
		.on('data', function(data) {
      var json = JSON.parse(data);

      if (json.status === 404) {
        
        deferred.resolve ([]);
      } else {
        deferred.resolve(json.aggregations.styles.buckets);
      }
		})
		.on('error', function(error) {
			console.log(error);
			deferred.reject(error);
		})
		.exec();
	
	return deferred.promise;
};


