/**
 * Created by dwellarkaruna on 24/10/15.
 */
var bookingDeclineController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('bookingDeclineController');
    $scope.loadingDemo = false;
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

 






    projectUrl = "Notes/CreateMultipleNotes";
    ProjectCreate = function () {
        var schemeupdate = [];

        var newscheme = {};
        newscheme.attention = _.pluck($scope.params.Name, 'text').join(','),
        newscheme.user_id = $cookieStore.get('userId');
        newscheme.organization_id = $cookieStore.get('orgID');
        newscheme.text = $scope.params.description;
        newscheme.class_id = window.sessionStorage.selectedCustomerID;
        newscheme.class_type = "Person";
        schemeupdate.push(newscheme);


        apiService.post(projectUrl, schemeupdate).then(function (response) {
            var choices2 = response.data;
            AuditCreate();
            $scope.loadingDemo = false;
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();

            $rootScope.$broadcast('REFRESH', 'NotesGrid');
            $rootScope.$broadcast('REFRESH1', { name: 'contactGrid', data: null, action: 'notesAdd' });
            $rootScope.$broadcast('REFRESH2', { name: 'LeadGrid', data: null, action: 'notesAdd' });
            $rootScope.$broadcast('REFRESH3', { name: 'ClientContactGrid', data: null, action: 'notesAdd' });
        },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
})
    };


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'sm',
            resolve: { items: { title: "Notes" } }
        });
    }



    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

 

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            $scope.loadingDemo = true;
            new ProjectCreate().then(function (response) {
                console.log(response);
                $scope.showValid = false;
                $state.go('guest.signup.thanks');
            }, function (error) {
                console.log(error);
            });

            $scope.showValid = false;

        }

    }


};




