

var OptionPopController = function ($scope, $state, $cookieStore, apiService, $rootScope, $modalInstance, $modal, $window) {
    console.log('OptionPopController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    var userID = $cookieStore.get('userId');

    $scope.checkedIds = [];

    tagUrl = "Tags/GetAllTagsWithId"
    apiService.get(tagUrl).then(function (response) {
        $scope.tags = response.data;
        $scope.isChecked = [];
        for (var a in $scope.tags) {
            if ($scope.tags[a].checkedd == "1") {
                $scope.isChecked[a] = true;
                $scope.checkedIds.push($scope.tags[a].id);
            }
        }
    },
 function (error) {
     if (error.status === 400)
         alert(error.data.Message);
     else
         alert("Network issue");
 });


    $scope.onClick = function (e) {

        var element = $(e.currentTarget);
        var checked = element.is(':checked');
        var fnd = 1;
        var id = $(e.target).data('id');
        for (k = 0; k < $scope.checkedIds.length; k++) {
            if ($scope.checkedIds[k] == id) {
                fnd = 0;
                break;
            }

        }
        if (fnd == 0) {
            $scope.checkedIds.splice(k, 1);

        }
        else {
            $scope.checkedIds.push(id);
        }
    }



    $scope.toggleClass = function (id) {
        $scope.isChecked[id] = $scope.isChecked[id] == true ? false : true;
        $scope.$apply();
    };

    $scope.addTag = function () {
        $cookieStore.put('checkedIds', $scope.checkedIds);
        var usersToBeAddedOnServer = [];
        $cookieStore.get('checkedIds');


        for (var j in $scope.tags) {

            var newAmenities = {};
            var found = 0;
            //   $scope.tags = response.data;
            //  newAmenities.amenities_type1 = $scope.tags[i].amenities_type1;
            for (var i in $scope.checkedIds) {

                if ($scope.checkedIds[i] == $scope.tags[j].id) {
                    found = 1;
                    break;
                }
            }

            var newMember = {};
            //newMember.amenities_type1 = $scope.checkedIds[i];
            newMember.tag_id = $scope.tags[j].id;
            newMember.user_id = $cookieStore.get('userId');
            newMember.organization_id = $cookieStore.get('orgID');
            newMember.checkedd = found;
            newMember.campaign_id = window.sessionStorage.selectedCustomerID;
            usersToBeAddedOnServer.push(newMember);
        }



        apiService.post("CampaignTag/CreateCampaignTag", usersToBeAddedOnServer).then(function (response) {
            var loginSession = response.data;

            //alert(" Done...");
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
        },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        })

    }

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {

            TagCreate($scope.params);
            $scope.showValid = false;

        }

    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Tags" } }
        });

        $rootScope.$broadcast('REFRESH', 'amenity');
    };
};