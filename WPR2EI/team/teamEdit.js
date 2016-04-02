/**
 * Created by dwellarkaruna on 24/10/15.
 */
var TeamEditPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('TeamEditPopUpController');



    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    var id = $scope.seletedCustomerId;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }


    projectUrl = "Team/GetbyID/" + id;

    //alert(projectUrl);
    //alert($scope.seletedCustomerId);
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data[0];

    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
}
    );

    $scope.params = {

        name: $scope.name,
        description: $scope.description,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),

    };

    $scope.save = function () {
        var postData =
               {
                   id: $scope.seletedCustomerId,
                   name: $scope.params.name,
                   description: $scope.params.description,
                   organization_id: $cookieStore.get('orgID'),
                   user_id: $cookieStore.get('userId'),
               };

        apiService.post("team/Edit", postData).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();


        },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        });
    }


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'lg',
            resolve: { items: { title: "Edit" } }
        });

        $rootScope.$broadcast('REFRESH', 'team');
    }

    $scope.editTeam = function (isValid) {
        $scope.showValid = true;
        if (isValid) {


            $scope.save();
            $scope.showValid = false;

        }


    }


};




