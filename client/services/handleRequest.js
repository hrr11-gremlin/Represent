angular.module('HandleRequests', [])

.factory('SendRequest', ['$http', '$rootScope', '$state', function($http, $rootScope, $state) {
  // Objects for holding API routes and keys.
  var nytimes = {
    reps: {
      host: '//api.nytimes.com/svc/politics/v3/us/legislative/congress/',
      key: '' // All API keys will be fetched from the server.
    },
    news: {
      host: 'http://api.nytimes.com/svc/search/v2/articlesearch.json?',
      key: ''
    }
  };
  var sunlight = {
    host: 'https://congress.api.sunlightfoundation.com/legislators/',
    key:''
  };
  var freegeoip = {
    host: 'https://freegeoip.net/json/'
  };

  // Basic get and post methods.
  var get = function(url) {
    console.log('Sending GET to', url);
    return $http({
      method: 'GET',
      url: url
    });
  };
  var post = function(url, data) {
    console.log('Sending POST to', url, 'with data:', data);
    return $http({
      method: 'POST',
      url: url,
      data: data
    });
  };

  // Fetch API keys from the server.
  get('/auth/keys').then(function (response) {
    nytimes.reps.key = response.data.NYTIMES_REPS;
    nytimes.news.key = response.data.NYTIMES_NEWS;
    sunlight.key = response.data.SUNLIGHT;
  });

  // Export object, with basic get and post methods.
  var factory = {};
  factory.get = get;
  factory.post = post;

  // Support for legacy API calls.
  factory.getRequest = get;
  factory.postRequest = post;


  // Returns an array of representatives for a given ZIP Code.
  factory.getRepsByZip = function(zip) {
    return get(sunlight.host + 'locate?zip=' + zip + '&apikey=' + sunlight.key)

    .then( function (response) {
      console.log ('Got representatives for ZIP:', zip);
      return response.data.results;

    }, function (error) {
      return console.log(error);
    });
  };


  // Returns an array of representatives from a guess at the user's location by IP.
  factory.getRepsByUserLoc = function () {
    return get(freegeoip.host)

    .then( function (response) {
      var lat = response.data.latitude;
      var lon = response.data.longitude;
      return get(sunlight.host + 'locate?latitude=' + lat + '&longitude=' + lon + '&apikey=' + sunlight.key)
      
      .then(function (response) {
        console.log('Got representatives for lat:', lat, 'and long:', lon);
        return response.data.results;

      }, function (error) {
        return console.log(error);
      });

    }, function (error) {
      return console.log(error);
    });
  };

  factory.newsFeed = function (name) {
    return get(nytimes.news.host + 'q=' + name + '&api-key=' + nytimes.news.key);
  };


  return factory;
}]);