angular.module('Results', [])
.factory('resultsFactory', function(){
  var memberInfo;
  var memberBio;
  var memberImageUrl;
  var memberFacebookUrl;
  var memberTwitterUrl;

  return { 
    memberInfo: memberInfo,
    memberBio: memberBio,
    memberImageUrl: memberImageUrl,
    memberFacebookUrl: memberFacebookUrl,
    memberTwitterUrl: memberTwitterUrl
  }
})


.controller('ResultsController',['$scope', '$rootScope', 'searchFactory','resultsFactory', function($scope, $rootScope, searchFactory, resultsFactory){
  $scope.memberInfo = resultsFactory.memberInfo;
  $scope.memberBio = resultsFactory.memberBio;
  $scope.memberImageUrl = resultsFactory.memberImageUrl;
  $scope.memberFacebookUrl = resultsFactory.memberFacebookUrl;
  $scope.memberTwitterUrl = resultsFactory.memberTwitterUrl;
  $scope.showPagination = true;
  $scope.pages = {
    min: 1,
    max: 10
  };
  
  //Circular animation
  var nonMissedVotes = (100 - $scope.memberInfo.missedVotesPerc)/100;
  var circle = new ProgressBar.Circle('#voteProgress', {
      color: '#FCB03C',
      strokeWidth: 6,
      trailWidth: 1,
      duration: 800,
      text: {
          value: '0 Votes',
          style: {
            color: 'coral',
            'font-size': 'x-large',
            left: '50%',
            top: '45%'
          }
      },
      step: function(state, bar) {
        bar.setText((bar.value() * '100').toFixed(0) + '%');
      }
  });

  circle.animate(.5, function() {
      circle.animate(nonMissedVotes);
  });
var withParty = ( $scope.memberInfo.votesWithParty / 100);
  var circle2 = new ProgressBar.Circle('#votesWithParty', {
      color: $scope.memberInfo.party === 'D' ? '#5274A6' : '#D94D4D',
      strokeWidth: 6,
      trailWidth: 1,
      duration: 800,
      text: {
          value: '0 Votes',
          style: {
            color: 'coral',
            'font-size': 'x-large',
            left: '50%',
            top: '45%'
          }
      },
      step: function(state, bar) {
        bar.setText((bar.value() * 100).toFixed(0) + '%');
        
      }
  });

  circle2.animate(.5, function() {
      circle2.animate(withParty);
  });

  //Pagination
  $scope.changePage = function(page) {
    $scope.prevMax = $scope.pages.max;
    $scope.pages.max = page * 10;
    $scope.pages.min =  (page * 10) - 10 + 1;
  };

  $scope.showAll = function() {
    $scope.showPagination = false;
    $scope.pages.max = 100;
    $scope.pages.min =  1;
  }

  $scope.showTen = function() {
    $scope.showPagination = true;
    $scope.search = "";
    $scope.pages.max = 10;
    $scope.pages.min =  1;
  }

}])
.run(function($rootScope, resultsFactory){
  var init = function(){
    if(localStorage.getItem('memberData') !== null){
      var data = JSON.parse(localStorage.getItem('memberData')); 
      resultsFactory.memberInfo = data.member;
      resultsFactory.memberBio = data.memberBio[0].split(';');
      resultsFactory.memberImageUrl = "https://theunitedstates.io/images/congress/225x275/" + data.member.id + ".jpg";
      resultsFactory.memberFacebookUrl = "http://www.facebook.com/" + data.member.facebook;
      resultsFactory.memberTwitterUrl = "http://www.twitter.com/" + data.member.twitter;
      data = JSON.parse(localStorage.getItem('currMemberVotes'));
      $rootScope.currentMember = data;
    }
  }
  $rootScope.$on('$stateChangeStart', function(){
    init();
  })
});

