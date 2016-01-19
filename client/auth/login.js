(function() {
  angular.module('Login', [])
  .controller('LoginController', ['$http', '$scope', '$state', 'DataCache', 'SendRequest', 
    function($http, $scope, $state, DataCache, SendRequest){
    $scope.user = {};
    $scope.login = function(user){
      $http({
        method: 'POST',
        url: '/auth/login',
        data: user
      }).success(function(data){
        // Setting loginKey creates a session
        localStorage.setItem('loginKey', data._id);
        // Get the user's previous searches from database and keep it in localStorage
        localStorage.setItem('searchCache', JSON.stringify(data.searchCache));
        if (data.zip) {
          localStorage.setItem('zip', data.zip);
          SendRequest.getRepsByZip(data.zip).then(function(reps) {
            DataCache.zipSearchReps = reps;
            $state.go('byDistrictResults');
          });
        } else {
          $state.go('main');
        }
      });
    };
  }]);
})();
