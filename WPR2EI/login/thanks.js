






angular.module('app.guest.login')

  .config(function config($stateProvider) {
      $stateProvider
          .state('thanks', {
              url: '/thanks',
              templateUrl: 'login/thanks.tpl.html',
              controller: 'ThanksController',
              data: { pageTitle: 'Thanks Page' }
          });
  })


.controller('ThanksController',
    function ($scope, $state, $rootScope) {

        $rootScope.title = 'Dwellar./Thanks';

       

        $scope.thanksLogin = function ()
        {
            $state.go('login');

           
        };
    }
);
