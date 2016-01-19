angular.module('Search', [])
.controller('SearchController',['$scope', '$rootScope', '$state', 'SendRequest', 'DataCache', 'ErrorDisplay', 'stateFactory', 'searchFactory',
 function($scope, $rootScope, $state, SendRequest, DataCache, ErrorDisplay, stateFactory, searchFactory){

  var self = this;
  
  $scope.getMemberAndVotes = searchFactory.getMemberAndVotes;

  $scope.load = loadAutosearchData;
  fillPlaceholder();
  $scope.query = query;
  $scope.errorMessage = ErrorDisplay.errorMessage;

  function fillPlaceholder () {
    if (!DataCache.repNamesByLoc.length) {
      SendRequest.getRepsByUserLoc().then(function(people) {
        var names = people.reduce(function(placeholder, person) {
          var fullName = person.first_name + ' ' + person.last_name;
          return placeholder.concat(fullName);
        }, []);
        $scope.placeholder = names.join(', ');
        DataCache.repNamesByLoc = $scope.placeholder;
      });
    } else {
      $scope.placeholder = DataCache.repNamesByLoc;
    }
  }

  function query(text) {
    var result = text ? self.names.filter(nameFilter(text)) : self.names;
    return result;
  }

  // Expecting back an array of the full names of all members of congress 
  function loadAutosearchData(text) {
    if ($scope.errorMessage.length) {
      $scope.errorMessage = '';
      ErrorDisplay.errorMessage = '';
    }
    if (!self.names && !DataCache.memberNames.length) {
      var url = '/api/allMembers';
      SendRequest.getRequest(url)
        .then(function(response) {
          var names = response.data;
          self.names = names.map(function(name) {
            // Splitting the names into lower case here to more easily filter below
            return {
              value: name.toLowerCase(),
              display: name
            }
          });
          DataCache.memberNames = self.names;
        });
    } else if (text) {
      self.names = DataCache.memberNames;
    }
  }
  
  function nameFilter(query) {
    var lowercase = angular.lowercase(query);

    return function filter (name) {
      return (name.value.indexOf(lowercase) === 0);
    };
  }

}]);