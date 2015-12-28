//angular.module('app.guest.login')//to change

//.config(function($stateProvider) {
//    $stateProvider
//        .state('thanks', {//tochange
//            url: '/thanks',
//            views: {
//                'main-content@guest': {
//                    templateUrl: 'login/thanks.tpl.html',//tochange
//                    controller: 'ThanksController'
//                }
//            },
//            data: {pageTitle: 'Thanks'}
//        });
//})

angular.module('app.guest.login')//to chnage

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
    function ($scope, $state) {
        $scope.addPersonalInfo = function (isValid) {
            if (isValid) {
                $state.go('login');
            }

        }
    }
);
