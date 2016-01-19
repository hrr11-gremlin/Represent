angular.module('Register', [])
.controller('RegisterController', ['$http', '$scope', function($http, $scope){
  $scope.user = {};
  $scope.register = function(user){
    $http({
      method: 'POST',
      url: '/auth/register',
      data: user
    }).success(function(data){
      localStorage.setItem('loginKey', data._id);
      localStorage.setItem('searchCache', JSON.stringify(data.searchCache));
      window.location.href = '/';
    });
  };
}]);