(function() {
  angular.module('Directives')
  .directive('region', ['$compile', 'SendRequest', '$rootScope', '$state', 
    function($compile, SendRequest, $rootScope, $state){
      return {
        restrict: 'A',
        scope: true,
        link: function(scope,element,attrs){
          scope.elementId = element.attr("id");
          scope.regionClick = function() {
      var url = 'api/byState/'+ scope.elementId;
      $rootScope.state = scope.elementId;
      SendRequest.getRequest(url)
      .success(function(data) {
        $rootScope.byStateResults = data;
        $state.go('byStateResults');
      })
      .error(function(err) {
        console.log(err);
      });
    };
          element.attr("ng-click", "regionClick()");
          element.removeAttr('region');
          $compile(element)(scope);
        }
      }
    }]);
})();


