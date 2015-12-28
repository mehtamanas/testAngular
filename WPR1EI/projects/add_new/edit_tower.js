var AddEditTowerController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $modal, $rootScope) {
    console.log('AddEditTowerController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    var tower_id = $cookieStore.get('tower_id');
   // var tower_id = $cookieStore.get('tower_id');

    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-dev2.azurewebsites.net/MediaElement/upload'
    });

    var uploader1 = $scope.uploader1 = new FileUploader({
        url: 'https://dw-webservices-dev2.azurewebsites.net/MediaElement/upload'
    });
    var uploader2 = $scope.uploader2 = new FileUploader({
        url: 'https://dw-webservices-dev2.azurewebsites.net/MediaElement/upload'
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

    // FILTERS

    // FILTERS
    uploader2.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });




    projectUrl = "Tower/GetMultipleWingTypebyTowerId?id=" + tower_id;
  
    apiService.get(projectUrl).then(function (response) {
        $scope.wings = response.data;


    },
function (error) {
    console.log("Error " + error.state);
}
    );


    projectUrl = "Tower/GetTowerByTower/" + tower_id;
    
    apiService.get(projectUrl).then(function (response) {
        $scope.params = response.data[0];


    },
function (error) {
    console.log("Error " + error.state);
}
    );

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md'
        });

        $rootScope.$broadcast('REFRESH', 'tower');
    };



    var upload1 = 0;
    var upload2 = 0;
    var upload3 = 0;
    $scope.media1 = "";
    $scope.media2 = "";
    $scope.media3 = "";
    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        uploadResult = response[0];
        // post image upload call the below api to update the database
        upload1 = 1;
        $scope.media1 = uploadResult.Location;
        if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
            $scope.showProgress = false;
            $scope.finalpost()
        }

    };

    // CALLBACKS
    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        uploadResult1 = response[0];

        upload2 = 1;
        $scope.media2 = uploadResult1.Location;
        if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
            $scope.showProgress = false;
            $scope.finalpost()
        }
    };


    // CALLBACKS
    uploader2.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        uploadResult2 = response[0];

        upload3 = 1;
        $scope.media3 = uploadResult2.Location;
        if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
            $scope.showProgress = false;
            $scope.finalpost()
        }

    };

    $scope.finalpost = function () {
        // TODO: Need to get these values dynamically
        var postData = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            media_name: "",
            Image_Url_Tower1: $scope.media1,
            // media_name: uploadResult1.Name,
            Image_Url_Tower3Dzip: $scope.media2,
            Image_Url_Minimap: $scope.media3,
            class_type: "Tower",
            media_type: "Logo",
            //id: window.sessionStorage.selectedCustomerID,
            tower_name: $scope.params.tower_name,
            no_of_wings: $scope.params.no_of_wings,
            base_price: $scope.params.base_price,
            cark_park_price: $scope.params.cark_park_price,
            floor_rise: $scope.params.floor_rise,
            floor_rise_starts_from: $scope.params.floor_rise_starts_from,
            id: tower_id
        };

        //alert(postData.city);
        //alert(postData.media_url);.

        apiService.post("Tower/EditTowerWing", postData).then(function (response) {
            var loginSession = response.data;
            var towerupdate = [];
            for (var i in $scope.wings) {
                var newTower = {};
                newTower.no_of_wings = $scope.wings[i].wing_no;
                newTower.tower_id = tower_id;
                newTower.wing_id = $scope.wings[i].wing_id;
             //   newTower.id = loginSession.id;
                towerupdate.push(newTower);
            }
            apiService.post("Tower/EditTowerWing1", towerupdate).then(function (response) {
                var loginSession = response.data;
                //  alert("Tower Updated...");
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();

            },
            function (error) {

            });

            //  alert("Tower Done...");
            $modalInstance.dismiss();

        },
        function (error) {

        });



        //uploadService.postDataAfterUpload(postData).then(function () {
        //    // Process the successful file upload
        //    alert("project Created");
        //}, function (error) {
        //    alert('Error creating');
        //})
    }



    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };


    uploader1.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };


    uploader2.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        //$scope.showProgress = false;
    };
    uploader1.onCompleteItem = function (fileItem, response, status, headers) {
        //$scope.showProgress = false;
    };
    uploader2.onCompleteItem = function (fileItem, response, status, headers) {
        //$scope.showProgress = false;
    };

    //    Url = "GetCSC/city";

    //    apiService.get(Url).then(function (response) {
    //        $scope.cities = response.data;

    //    },
    //function (error) {
    //    alert("Error " + error.state);
    //});


    //    $scope.selectcity = function () {
    //        $scope.params.city = $scope.city1;
    //        //alert($scope.params.city);
    //    };


    //    Url = "GetCSC/state";

    //    apiService.get(Url).then(function (response) {
    //        $scope.states = response.data;

    //    },
    //function (error) {
    //    alert("Error " + error.state);
    //});


    //    $scope.selectstate = function () {
    //        $scope.params.state = $scope.state1;
    //        //alert($scope.params.state);
    //    };


    //    $scope.selectapartment = function () {
    //        $scope.params.project_type = "Apartment"

    //        alert($scope.params.project_type);
    //    };


    //    $scope.selecthome = function () {
    //        $scope.params.project_type = "Family And Home";
    //        alert($scope.params.project_type);
    //    };

    //    $scope.selectvilla = function () {
    //        $scope.params.project_type = "Villa";
    //        alert($scope.params.project_type);
    //    };

    //    $scope.selectplot = function () {
    //        $scope.params.project_type = "Plot";
    //        alert($scope.params.project_type);
    //    };





    //Audit log start															
    $scope.params =
        {
            device_os: $cookieStore.get('Device_os'),
            device_type: $cookieStore.get('Device'),
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "Contact",
            action_id: "Contact View",
            details: "EditTower",
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
    $scope.params = {

        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId'),
        tower_name: $scope.tower_name,
        //no_of_wings: $scope.no_of_wings,
        base_price: $scope.base_price,
        cark_park_price: $scope.cark_park_price,
        floor_rise: $scope.floor_rise,
        floor_rise_starts_from: $scope.floor_rise_starts_from
    };

    //var emp = {
    //    //id: $cookieStore.get('projectid'),

    //    organization_id: $cookieStore.get('orgID'),
    //    User_ID: $cookieStore.get('userId'),
    //    tower_name: $scope.tower_name,
    //    no_of_wings: $scope.no_of_wings
    //};

    //if ($cookieStore.get('projectid') !== '') {
    //    apiService.get('Project/GetbyID/' + $cookieStore.get('projectid')).then(function (response) {
    //        $scope.data = response.data;
    //        angular.forEach($scope.data, function (value, key) {
    //            $scope.params.name = value.name;
    //            $scope.params.description = value.description;
    //        });
    //    },
    //            function (error) {
    //                deferred.reject(error);
    //                alert("not working");
    //            });
    //}


    // projectUrl = "Project/ProjectAddress";
    // ProjectCreate = function (param) {
    //     //alert(param.name);
    //     apiService.post(projectUrl, param).then(function (response) {
    //         var loginSession = response.data;
    //         alert("Project Created..!!");
    //         $modalInstance.dismiss();


    //     },
    //function (error) {
    //    alert("Error " + error.state);
    //});
    // };

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