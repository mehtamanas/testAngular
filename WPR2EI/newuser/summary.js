
angular.module('newuser')//to chnage

      .config(function config($stateProvider) {
          $stateProvider
              .state('summary', {
                  url: '/summary',
                  templateUrl: 'newuser/summary.html',
                  controller: 'SummaryController',
                  data: { pageTitle: 'Summary Page' }
              });
      })


.controller('SummaryController',
    function ($scope, $state) {
        $scope.addPersonalInfo = function (isValid) {
            if (isValid) {
                $state.go('newuser');
            }

        }
    }
);