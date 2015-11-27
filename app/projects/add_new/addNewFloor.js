var AddNewFloorController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService,$window) {
    console.log('AddNewFloorController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
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



    projectUrl = "UnitTypes/Get_Unit_Type?id=" + $scope.seletedCustomerId + "&orgID=" + orgID;
    
   alert(projectUrl);
    apiService.get(projectUrl).then(function (response) {
        $scope.units = response.data;

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
            userid: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            media_name: uploadResult.Name,
            media_url: uploadResult.Location,
            class_type: "Project",
            id: window.sessionStorage.selectedCustomerID,
           // unit_type_desc: $scope.params.unit_type_desc,
            no_of_units: $scope.params.no_of_units,
            media_type: "Logo",
            unit_name:$scope.params.unit_name,
            unit_no:$scope.params.unit_no
        };





        //alert(postData.city);
        //alert(postData.media_url);
        apiService.post("FloorType/FloorCreate", postData).then(function (response) {
            var loginSession = response.data;

            var unitupdate = [];

            for (var i in $scope.units) {

                var newUnit = {};

                newUnit.unit_type_desc = $scope.units[i].unit_type_desc;
                newUnit.no_of_units = $scope.units[i].no_of_units;
              newUnit.floorID = $scope.units[i].id;
                newUnit.id = loginSession.id;
                unitupdate.push(newUnit);
            }

            apiService.post("UnitTypes/Edit_Unit_type", unitupdate).then(function (response) {
                var loginSession = response.data;
                alert("Unit Edit Done...");
                $modalInstance.dismiss();

            },
            function (error) {

            });

            alert("Floor Done...");
         
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
       
        unit_name: $scope.unit_name,
        unit_no: $scope.unit_no,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId')
    };

    var emp = {
        //id: $cookieStore.get('projectid'),
        unit_type_desc: $scope.unit_type_desc,
        no_of_units: $scope.no_of_units,
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