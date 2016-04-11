angular.module('app.guest.login')

     .config(function config($stateProvider) {
         $stateProvider
             .state('Forgetpassword', {
                 url: '/RecoverPassword',
                 templateUrl: 'login/Forgetpassword.tpl.html',
                 controller: 'ForgetpasswordController',
                 data: { pageTitle: 'Forgetpassword' }
             });
     })
.controller('ForgetpasswordController',
    function ($scope, apiService, $state, security, $rootScope) {

        $rootScope.title = 'Dwellar./RecoverPassword';

           $scope.params = {
               account_email: $scope.account_email
               };

           $scope.post = {
               account_phone: $scope.account_phone
           };

           $scope.confirms = {
               hash: $scope.hash
           };
           if ($scope.account_email === "" && $scope.account_phone === "")
           {
               return;
           }
           projectUrl = "Register/RecoverPasswordByEmail";
           ProjectCreate = function (param) {
               
               apiService.post(projectUrl, param).then(function (response) {
                   var loginSession = response.data;
                   swal("Success","Password Recovered By Your Email..!!",'success')
                   //alert("Password Recovered By Your Email..!!");
                   


               },
          function (error) {
              swal("Failure", "Entered email address belongs to inactive user and/or invalid user !!", 'error')
              //alert("Entered email address belongs to inactive user and/or ");
          });
           };



           $scope.loginemail = function (isValid) {
               $scope.showValid = true;
               if ($scope.params.account_email == undefined) {
                   return;
               }
               if ($scope.params.account_email == "") {
                   return;
               }
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
               if ($scope.params.account_phone == undefined) {
                   return;
               }
               if ($scope.params.account_phone == "") {
                   return;
               }
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