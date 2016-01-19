(function() {
  angular.module('errors', [])
    .factory('ErrorDisplay', ['$rootScope', '$state',
      function($rootScope, $state) {
        var errorMessage = '';

        return {
          errorMessage: errorMessage
        };
      }
    ]);
})();