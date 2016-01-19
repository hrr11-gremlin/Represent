(function() {
  angular.module('CongressionalStalker', [
    'Search',
    'Results',
    'ui.router',
    'ui.materialize',
    'ngMaterial',
    'Register',
    'Login',
    'Logout',
    'HandleRequests',
    'Directives',
    'ByState',
    'ByStateResults',
    'DlFilters',
    'ByDistrictResults',
    'dataCache',
    'errors'
  ])

  .factory('stateFactory', [function(){
    var loginCheck = function(){
      return localStorage.getItem('loginKey') !== null;
    };
    var searchCacheCheck = function(){
      return JSON.parse(localStorage.getItem('searchCache')).length > 0;
    };
    //ATTN MATT vvv
    var nameCase = function(name){
      name.toLowerCase();
      var split = name.split(' ');
      for(var i = 0; i < 2; i++){
        var firstLetter = String.fromCharCode(split[i].charCodeAt(0) - 32);
        split[i] = firstLetter + split[i].slice(1);
      }
      return split.join(' ');
    };
    return {
      loginCheck: loginCheck,
      searchCacheCheck: searchCacheCheck,
      nameCase: nameCase
    }
  }])

  .controller('AuthCheck', ['$scope', 'stateFactory', function($scope, stateFactory){
    $scope.loginCheck = stateFactory.loginCheck;
    $scope.searchCacheCheck = stateFactory.searchCacheCheck;
  }])

  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'components/search/searchView.html',
        controller: 'SearchController'
      })
      .state('results', {
        url:'/results',
        templateUrl: 'components/results/resultsView.html',
        controller: 'ResultsController'
      })
      .state('auth', {
        url: '/api/auth',
        templateUrl: 'auth/login.html',
        controller: 'LoginController'
      })
      .state('login', {
        url: '/api/login',
        templateUrl: 'auth/login.html',
        controller: 'LoginController'
      })
      .state('register', {
        url: '/api/register',
        templateUrl: 'auth/register.html',
        controller: 'RegisterController'
      })
      .state('logout', {
        url: '/api/logout',
        templateUrl: 'auth/logout.html',
        controller: 'LogoutController'
      })
      .state('byState', {
        url:'/api/byState',
        templateUrl: 'components/search/byState.html',
        controller: 'ByStateController'
      })
      .state('byStateResults', {
        url:'/api/byState/results',
        templateUrl: 'components/results/byStateResults.html',
        controller: 'ByStateResultsController'
      })
      .state('byDistrictResults', {
        url:'/byDistrictResults/results',
        templateUrl: 'components/results/byDistrictResults.html',
        controller: 'ByDistrictResultsController'
      });
  }])

  .run(['$rootScope', function($rootScope){
    var updateSearchCache = function(){
      return JSON.parse(localStorage.getItem('searchCache'));
    };
    $rootScope.$on('$stateChangeStart', function(){
      if(localStorage.getItem('searchCache')){
        $rootScope.searchCache = updateSearchCache();
      }
    });
  }]);

})();