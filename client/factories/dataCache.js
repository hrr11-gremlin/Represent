(function() {
  angular.module('dataCache', ['HandleRequests'])
    .factory('DataCache', ['$rootScope', '$state', function($rootScope, $state) {
      var memberNames = [];
      var repNamesByLoc = '';
      var zipSearchReps = [];

      return {
        memberNames: memberNames,
        repNamesByLoc: repNamesByLoc,
        zipSearchReps: zipSearchReps
      };

    }]);
})();