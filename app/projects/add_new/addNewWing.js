var AddNewWingController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window) {
    console.log('AddNewWingController');

    var orgID = $cookieStore.get('orgID');

    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
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
    projectUrl = "FloorType/Get_Floor_Type?orgID=" + orgID;

    alert(projectUrl);
    apiService.get(projectUrl).then(function (response) {
        $scope.floors = response.data;

    },
function (error) {
    alert("Error " + error.state);
}
    );

    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        var uploadResult = response[0];

        // TODO: Need to get these values dynamically
        var postData = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            media_name: uploadResult.Name,
            media_url: uploadResult.Location,
            class_type: "Project",
            media_type: "Logo",
            wing_code: $scope.params.wing_code,
            total_no_of_floors: $scope.params.total_no_of_floors,
            id: window.sessionStorage.selectedCustomerID,
         
        };

        //alert(postData.city);
        //alert(postData.media_url);
        apiService.post("WingType/CreateNew_WingsType", postData).then(function (response) {
            var loginSession = response.data;
            alert("Wings done");
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
    };

    uploader.onErrorItem = function (fileItem, response, status, headers) {
        alert('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
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
    // $scope.params = {

    //     device_os: "windows10",
    //     device_type: "mobile",
    //     device_mac_id: "34:#$::43:434:34:45",
    //     module_id: "Addnew Project",
    //     action_id: "Addnew Project View",
    //     details: "Addnew Project detail",
    //     application: "angular",
    //     browser: $cookieStore.get('browser'),
    //     ip_address: $cookieStore.get('IP_Address'),
    //     location: $cookieStore.get('Location'),
    //     organization_id: $cookieStore.get('orgID'),
    //     User_ID: $cookieStore.get('userId')
    // };


    // AuditCreate = function (param) {

    //     apiService.post("AuditLog/Create", param).then(function (response) {
    //         var loginSession = response.data;

    //     },
    //function (error) {

    //});
    // };
    // AuditCreate($scope.params);

    //end


    $scope.params = {
        wing_code: $scope.wing_code,
        total_no_of_floors: $scope.total_no_of_floors,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId')
    };

    var emp = {
        //id: $cookieStore.get('projectid'),
        wing_code: $scope.wing_code,
        total_no_of_floors: $scope.total_no_of_floors,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId')
    };

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