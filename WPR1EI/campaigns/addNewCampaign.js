angular.module('campaigns')
      
.controller('AddNewcampaign', function ($scope, $state, $cookieStore, apiService, $modal, $rootScope, $window)
{
    console.log("AddNewcampaign");
    

    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
    };

    $scope.user = function () {
       
        $state.go('app.campaigns');

    }
 
    $scope.params = {
        name: $scope.name,
        start_date1: $scope.start_date1,
        end_date: $scope.end_date,
        Street_1: $scope.Street_1,
        project_id: $scope.project1,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
    };

    
  

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
             var date = moment($scope.start_date1, 'DD/MM/YYYY HH:mm A')._d
             date = new Date(date).toISOString();
	 var Enddate = moment($scope.params.end_date, 'DD/MM/YYYY HH:mm A')._d
             Enddate = new Date(Enddate).toISOString();
            $cookieStore.put('Name', $scope.params.name);
            $cookieStore.put('End_Date', Enddate );
            $cookieStore.put('Address', $scope.params.Street_1);
            $cookieStore.put('Start_Date', date);
	    $cookieStore.put('project_id', $scope.project1);
            $state.go('app.budget');
            $scope.showValid = false;

        }

    }

});