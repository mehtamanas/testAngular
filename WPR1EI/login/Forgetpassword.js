angular.module('app.guest.login')

     .config(function config($stateProvider) {
         $stateProvider
             .state('Forgetpassword', {
                 url: '/Forgetpassword',
                 templateUrl: 'login/Forgetpassword.tpl.html',
                 controller: 'ForgetpasswordController',
                 data: { pageTitle: 'Forgetpassword' }
             });
     })
.controller('ForgetpasswordController',
    function ($scope, apiService, $state, security) {
           $scope.params = {
               account_email: $scope.account_email
               };

           $scope.post = {
               account_phone: $scope.account_phone
           };

           $scope.confirms = {
               hash: $scope.hash
           };

           projectUrl = "Register/RecoverPasswordByEmail";
           ProjectCreate = function (param) {
               
               apiService.post(projectUrl, param).then(function (response) {
                   var loginSession = response.data;
                   alert("Password Recovered By Your Email..!!");
                   


               },
          function (error) {
              alert("Error " + error.state);
          });
           };



           $scope.loginemail = function (isValid) {
               $scope.showValid = true;
               if (isValid) {
                   new ProjectCreate($scope.params).then(function (response) {
                       console.log(response);
                       $scope.showValid = false;
                       $state.go('guest.signup.thanks');
                   }, function (error) {
                       console.log(error);
                   });


                   $scope.showValid = false;

               }

           }



           passwordUrl = "Register/RecoverByMobileNo";
           PasswordCreate = function (param) {
               
               apiService.post(passwordUrl, param).then(function (response) {
                   var loginSession = response.data;
                   alert("Password Recovered By Your Phone number..!!");



               },
          function (error) {
              alert("Error " + error.state);
          });
           };



           $scope.loginphone = function (isValid) {
               $scope.showValid = true;
               if (isValid) {
                   new PasswordCreate($scope.post).then(function (response) {
                       console.log(response);
                       $scope.showValid = false;
                       $state.go('guest.signup.thanks');
                   }, function (error) {
                       console.log(error);
                   });


                   $scope.showValid = false;

               }

           }


    });