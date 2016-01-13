var AddNewAmenityController = function ($scope, $modal, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $rootScope) {
    console.log('AddNewAmenityController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');

    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-uat.azurewebsites.net/MediaElement/upload'
    });

    $scope.showProgress = false;

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });



    $scope.checkedIds = [];

    



    projectUrl = "Amenities/GetAmenitiesall?id=" + $scope.seletedCustomerId;//8c4128e2-785b-4ad6-85af-58344dd79517";

    // alert(param.name);
    apiService.get(projectUrl).then(function (response) {
        $scope.orgAmenities = response.data;
        $scope.isChecked = [];
        for (var a in $scope.orgAmenities) {
            if ($scope.orgAmenities[a].checkedd == "1") {
                $scope.isChecked[a] = true;
                $scope.checkedIds.push($scope.orgAmenities[a].id);
            }
        }

    },
 function (error) {
     alert("Error " + error.state);
 }
    );

   
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

    $scope.addamenity = function () {
        $cookieStore.put('checkedIds', $scope.checkedIds);
        var usersToBeAddedOnServer = [];
        $cookieStore.get('checkedIds');


        for (var j in $scope.orgAmenities) {

            var newAmenities = {};
            var found = 0;
            //   $scope.orgAmenities = response.data;
            //  newAmenities.amenities_type1 = $scope.orgAmenities[i].amenities_type1;
            for (var i in $scope.checkedIds) {

                if ($scope.checkedIds[i] == $scope.orgAmenities[j].id) {
                    found = 1;
                    break;
                }
            }


            var newMember = {};
            //newMember.amenities_type1 = $scope.checkedIds[i];
            newMember.amenity_type_id = $scope.orgAmenities[j].id;
            newMember.user_id = $cookieStore.get('userId');
            newMember.organization_id = $cookieStore.get('orgID');
            newMember.checkedd = found;
            newMember.description = $scope.description;
            newMember.id = window.sessionStorage.selectedCustomerID;
            usersToBeAddedOnServer.push(newMember);
        }


        // Add the new users
       // alert(id);


        apiService.post("Amenities/CreateNew_Amenities", usersToBeAddedOnServer).then(function (response) {
            var loginSession = response.data;
            
            //alert(" Done...");
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
        },


    function (error) {

    });
        attributes: {
            "class";"UseHand"

            }
    }





    //var amenityToBeAddedOnServer = [];
    //var newMember = {};

    //var Url;

    //    for (var i in $scope.checkedIds) {


    //        newMember.amenities_type1 = $scope.params.amenities_type1;
    //        amenityToBeAddedOnServer.push(newMember);
    //    }

    //    Url = "AmenitiesType/CreateNew_AmenitiesType";

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Amenities" } }
        });

        $rootScope.$broadcast('REFRESH','amenity');
    };






    $scope.params = {

        amenity_type_id: $scope.amenity_type_id,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
    };



    //Audit log start															
    $scope.params =
        {
            device_os: $cookieStore.get('Device_os'),
            device_type: $cookieStore.get('Device'),
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "Contact",
            action_id: "Contact View",
            details: "AddNewAmenities",
            application: "angular",
            browser: $cookieStore.get('browser'),
            ip_address: $cookieStore.get('IP_Address'),
            location: $cookieStore.get('Location'),
            organization_id: $cookieStore.get('orgID'),
            User_ID: $cookieStore.get('userId')
        };

    AuditCreate = function (param) {
        apiService.post("AuditLog/Create", param).then(function (response) {
            var loginSession = response.data;
        },
   function (error) {

   });
    };
    AuditCreate($scope.params);

    //end

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {


            //new ProjectCreate($scope.params).then(function (response) {
            //    console.log(response);
            //    $scope.showValid = false;
            //    $state.go('guest.signup.thanks');
            //}, function (error) {
            //    console.log(error);
            //});

            $scope.showValid = false;

        }

    }

};