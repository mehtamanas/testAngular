var AddNewTowerController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $modal, $rootScope) {
    console.log('AddNewTowerController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');

    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-uat.azurewebsites.net/MediaElement/upload',
        queueLimit: 1
    });

    var uploader1 = $scope.uploader1 = new FileUploader({
        url: 'https://dw-webservices-uat.azurewebsites.net/MediaElement/upload',
        queueLimit: 1
    });
    var uploader2 = $scope.uploader2 = new FileUploader({
        url: 'https://dw-webservices-uat.azurewebsites.net/MediaElement/upload',
        queueLimit: 1
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
    uploader1.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|x-zip-compressed|'.indexOf(type) !== -1;
        }
    });



    // FILTERS
    uploader2.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });



    
    projectUrl = "WingType/Get_Wing_Type?id=" + $scope.seletedCustomerId + "&orgID=" + orgID;
   // alert($scope.seletedCustomerId);
   // alert(orgID);
   //alert(projectUrl);
    apiService.get(projectUrl).then(function (response) {
        $scope.wings = response.data;


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
            size: 'md',
            resolve: { items: { title: "Tower" } }
        });

        $rootScope.$broadcast('REFRESH','tower');
    };


   
    var upload1 = 0;
    var upload2 = 0;
    var upload3 = 0;
    $scope.media1 = "";
    $scope.media2 = "";
    $scope.media3= "";
    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
     uploadResult = response[0];
        // post image upload call the below api to update the database
     upload1 = 1;
     $scope.media1 = uploadResult.Location;
     if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
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
            $scope.finalpost()
        }

    };

 

    $scope.finalpost = function () {
        // TODO: Need to get these values dynamically
        var postData = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            media_name: "",
            media_url: $scope.media1,
            // media_name: uploadResult1.Name,
            Media_3d_zip: $scope.media2,
            Minimap: $scope.media3,
            class_type: "Tower",
            media_type: "Logo",
            id: window.sessionStorage.selectedCustomerID,
            tower_name: $scope.params.tower_name,
            no_of_wings: $scope.params.no_of_wings,
            Base_Price: $scope.params.Base_Price,
            CarParkPrice: $scope.params.CarParkPrice,
            FloorRise: $scope.params.FloorRise,
            FloorRiseStartsFrom: $scope.params.FloorRiseStartsFrom
        };

        var fnd = 0;
        for (var i in $scope.wings) {

            if ($scope.wings[i].total_no_of_floors_new != null) {
                fnd = 1;
                break;
            }
        }
        if (fnd == 0) {
            alert("No Wing Mapped.....");
            retrun;
        }


        apiService.post("Tower/CreateTower", postData).then(function (response) {
            var loginSession = response.data;
            var towerupdate = [];
            for (var i in $scope.wings) {
                var newTower = {};
                newTower.total_no_of_floors = $scope.wings[i].total_no_of_floors_new;
                newTower.wing_code = $scope.wings[i].wing_code;
                newTower.wingid = $scope.wings[i].id;
                newTower.id = loginSession.id;
                towerupdate.push(newTower);
            }
            apiService.post("Tower/TowerUpdate", towerupdate).then(function (response) {
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
            alert(error.data.Message);
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
        aleconsole.log('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };
    uploader1.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };
    uploader2.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
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
            details: "AddNewTower",
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
        no_of_wings: $scope.no_of_wings,
        Base_Price: $scope.Base_Price,
        CarParkPrice: $scope.CarParkPrice,
        FloorRise: $scope.FloorRise,
        FloorRiseStartsFrom: $scope.FloorRiseStartsFrom
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