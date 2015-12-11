angular.module('app.guest.login')

      .config(function config($stateProvider) {
          $stateProvider
              .state('builder_directory', {
                  url: '/builder_directory',
                  templateUrl: 'login/builder_directory.html',
                  controller: 'BuilderDirectoryController',
                  data: { pageTitle: 'Builder Directory Page' }
              });
      })
 .controller('BuilderDirectoryController',
   function ($scope, $state, security, $cookieStore, apiService, $http) {





       projectUrl = "Organization/GetAllBuilder";

       // alert(param.name);
       apiService.get(projectUrl).then(function (response) {
           $scope.orgUsers = response.data;

       },
  function (error) {
      console.log("Error " + error.state);
  }

  );
       $scope.customNavigate = function (e) {
           var id = $(e.target).data('id');
           window.sessionStorage.selectedCustomerID = id;
           $state.go('builder_directory_detail');
       }




   }
);