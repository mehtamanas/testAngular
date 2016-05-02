var AddNewAmenityController = function ($scope, $modal, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $rootScope) {
    console.log('AddNewAmenityController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');

    var uploader = $scope.uploader = new FileUploader({
        url: apiService.baseUrl +'MediaElement/upload'
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
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.orgAmenities = response.data;
        $scope.isChecked = [];
        for (var a in $scope.orgAmenities) {
            if ($scope.orgAmenities[a].checkedd == "1") {
                $scope.isChecked[a] = true;
                $scope.checkedIds.push($scope.orgAmenities[a].id);
            }
        }

    },
 function (error)
 {
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
            AuditCreate();
            
            //alert(" Done...");
            $modalInstance.dismiss();
            $scope.openUpdatedfullPopup();
        },


    function (error)
    {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
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

    $scope.openUpdatedfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'projects/UpdateSuccessful.tpl.html',
            backdrop: 'static',
            controller: UpdateController,
            size: 'lg',
            resolve: { items: { title: "Amenities" } }
        });

        $rootScope.$broadcast('REFRESH','amenity');
    };






    $scope.params = {

        amenity_type_id: $scope.amenity_type_id,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
    };



    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "EditEvent",
           details: $scope.amenity_type_id + "EditEvent",
           application: "angular",
           browser: $cookieStore.get('browser'),
           ip_address: $cookieStore.get('IP_Address'),
           location: $cookieStore.get('Location'),
           organization_id: $cookieStore.get('orgID'),
           User_ID: $cookieStore.get('userId'),

       };


        apiService.post("AuditLog/Create", postdata).then(function (response) {
            var loginSession = response.data;
        },
    function (error) {
    });
    };


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