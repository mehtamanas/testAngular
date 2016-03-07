angular.module('app.guest.login')

      .config(function config($stateProvider) {
          $stateProvider
              .state('builder_directory_detail', {
                  url: '/builder_directory_detail',
                  templateUrl: 'login/builder_directory_detail.html',
                  controller: 'BuilderDirectoryDetailController',
                  data: { pageTitle: 'Builder Directory Details Page' }
              });
      })

.controller('BuilderDirectoryDetailController',
    function ($scope, $state, COUNTRIES, apiService, $cookieStore, $modal) {
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        projectUrl = "Organization/GetBuilderDetails?id=" + $scope.seletedCustomerId;

        // alert(param.name);
        apiService.get(projectUrl).then(function (response) {
            $scope.builddetail2 = response.data;
            $scope.builddetail = $scope.builddetail2[0];
        },
   function (error) {
       console.log("Error " + error.state);


   }
   );
        

        projectUrl = "Organization/GetBuilderDetails1?id=" +    $scope.seletedCustomerId;

       
        apiService.get(projectUrl).then(function (response) {
            $scope.orgUsers = response.data;

        },
   function (error) {
       console.log("Error " + error.state);
   }
        );

        $scope.openChannelPopup = function () {
            if ($cookieStore.get('userId') == undefined)
            {
                
                $cookieStore.put('builderflow', "yes");
                $state.go('login');
                return;
            }
            $state.go('channel_form');
        };
    }


);
