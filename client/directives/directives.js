(function() {
  angular.module('Directives', [])
    .factory('searchFactory', ['$rootScope', '$state', 'SendRequest', 'DataCache', 'ErrorDisplay',
     function( $rootScope, $state, SendRequest, DataCache, ErrorDisplay){
      var congressNumber = '113';
      var house = 'house';

      var getAPIVotes= function(id) {
        $rootScope.loading = true;
        /* SendRequest is a factory located in the handleRequest.js file */
        SendRequest.getRepWithVotes(id)
        .then(function (rep) {
          localStorage.setItem('currMemberVotes', JSON.stringify(rep));
          $rootScope.loading = false;
          $rootScope.currentMember = rep;
          $state.go('results');
        })
        .catch(function(err) {
          ErrorDisplay.errorMessage = 'ERR: data not found';
          console.log(ErrorDisplay.errorMessage);
        });
      };

      var getMemberAndVotes = function(name) {
        var url = 'api/getOneMember/'+name;
        // allowing users to input zipcodes as well, and hijacking this function
        // to change the api call for zip codes instead of rep names
        var zipcode = !!parseInt(name, 10) ? name : null;
        // error checking for zipcodes less than 5 digits long (necessary for api call)
        if (zipcode && name.length < 5) {
          ErrorDisplay.errorMessage = zipcode + ' is not a valid zipcode.'
          + ' Please enter in a five digit zipcode or search name.';
          $scope.errorMessage = ErrorDisplay.errorMessage;
          return;
        }
        if (zipcode) {
          SendRequest.getRepsByZip(zipcode).then(function(reps) {
            console.log('DATA FROM ZIP: ', reps);
            DataCache.zipSearchReps = reps;
            $state.go('byDistrictResults');
            return;
          });
        } else {
          SendRequest.getRequest(url)
          .then(function(response) {
            var data = response.data;
            // console.log(data.member, ' in the getmembers and votes');
            if(localStorage.getItem('loginKey')){
              updateSearchCache({_id: localStorage.getItem('loginKey'), search: {name: name, id: data.member.id}});
            }
            localStorage.setItem('memberData', JSON.stringify(data));
            //switched get API from rootscope to this factory...
            getAPIVotes(data.member.id);
            $state.go($state.current, {}, {reload: true});
          })
          .catch(function(err) {
            ErrorDisplay.errorMessage = 'No congresspeople matching the name '
            + $rootScope.nameCase(name) + ' were found, please enter in a different name or search by zipcode.';
            $scope.errorMessage = ErrorDisplay.errorMessage;
          });
        }
      };

      var updateSearchCache = function(info){
      // console.log('in update search cache before request');
        SendRequest.postRequest('/api/user/cacheSearch', info)
          .then(function(response){
            var data = response.data;
            // console.log(data, ' in update search cache after request');
            localStorage.setItem('searchCache', JSON.stringify(data));
          });
        };

      return{
        congressNumber: congressNumber,
        getAPIVotes: getAPIVotes,
        house: house,
        getMemberAndVotes: getMemberAndVotes,
        updateSearchCache: updateSearchCache,
      }
    }])



    .directive('dlSearchMember', [function() {
         return {
        restrict: 'A',
        templateUrl: '/directives/searchMember.html',
        scope: false,
        controller: 'SearchController',
        bindToController: true
      };
    }]);
})();