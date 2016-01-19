(function() {
  angular.module('Directives')
  .directive('svgMap',['$compile', function($compile){
    return {
      restrict: 'A',
      templateUrl: './images/Blank_US_Map.svg',
      link: function(scope, element, attrs){
        var regions = element[0].querySelectorAll('.state');
        angular.forEach(regions, function(path,key){
          var regionElement = angular.element(path);
          regionElement.attr("region","");
          $compile(regionElement)(scope);
        })
      }
    }
  }]);
})();

