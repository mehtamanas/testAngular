angular.module('channel_partners')

.controller('Channel_FormController',
      function ($scope, $state, COUNTRIES, apiService, $cookieStore, $modal) {

          $scope.params = {
              first_name: $scope.first_name,
              last_name: $scope.last_name,
              account_email: $scope.account_email,
              project_site: $scope.project_site,
              
          };
          var emp = {
              first_name: $scope.first_name,
              last_name: $scope.last_name,
              account_email: $scope.account_email,
              project_site: $scope.project_site,
             
          };
          $scope.confirms = {
              hash: $scope.hash
          };
          $scope.addNew = function (isValid) {
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

      }

);

