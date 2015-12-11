var uploader_done = false;
var uploader1_done = false;
var uploader2_done = false;
var uploader3_done = false;


var ProjectPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $modal) {
    console.log('ProjectPopUpController');



    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
    });

    var uploader1 = $scope.uploader1 = new FileUploader({
        url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
    });
    var uploader2 = $scope.uploader2 = new FileUploader({
        url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
    });
    var uploader3 = $scope.uploader3 = new FileUploader({
        url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
    });

    $scope.showProgress = false;


    getApi = function () {

    };




    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|zip|rar'.indexOf(type) !== -1;
        }
    });

    // FILTERS
    uploader1.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|zip|rar'.indexOf(type) !== -1;
        }
    });

    // FILTERS
    uploader2.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|zip|rar'.indexOf(type) !== -1;
        }
    });

    // FILTERS
    uploader3.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|zip|rar'.indexOf(type) !== -1;
        }
    });


    


    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
       // alert("uploader called");
        uploadResult = response[0];
        uploader_done = true;

        if (uploader_done==true && uploader1_done==true && uploader2_done==true && uploader3_done==true) {
            callApi();
        }
        // post image upload call the below api to update the database

        //uploadService.postDataAfterUpload(postData).then(function () {
        //    // Process the successful file upload
        //    alert("project Created");
        //}, function (error) {
        //    alert('Error creating');
        //})
    };



    // CALLBACKS
    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        console.log("uploader1 called");
        uploadResult1 = response[0];
        uploader1_done = true;
        if (uploader_done == true && uploader1_done == true && uploader2_done == true && uploader3_done == true) {

            callApi();
        }
    };

    // CALLBACKS
    uploader2.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        console.log("uploader2 called");
        uploadResult2 = response[0];
        uploader2_done = true;
        if (uploader_done == true && uploader1_done == true && uploader2_done == true && uploader3_done == true) {
            callApi();
        }
    };


    // CALLBACKS

    uploader3.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        console.log("uploader3 called");
        uploadResult3 = response[0];
        uploader3_done = true;
        if (uploader_done == true && uploader1_done == true && uploader2_done == true && uploader3_done == true) {
            callApi();
          }
    };


    var called = false;
    callApi = function () {
        if (called == true){
            return;}
        called = true;
        // TODO: Need to get these values dynamically
        var postData = {
            userid: $cookieStore.get('userId'),
            name: $scope.params.name,
            organization_id: $cookieStore.get('orgID'),
            media_logo_name: uploadResult.Name,
            media_url1: uploadResult.Location,
            //media_home_name: uploadResult1.Name,
            media_url2: uploadResult1.Location,
            //media_project_name: uploadResult2.Name,
            media_url3: uploadResult2.Location,
           // media_name: uploadResult.Name,
            media_url4: uploadResult3.Location,
            possession_date: $scope.params.possession_date,
            total_area: $scope.params.totalProjectArea,
            year:$scope.params.project_year,
            class_type: "Project",
            street_2: $scope.params.street_2,
            media_type: "Logo",
            city: $scope.params.city,
            state: $scope.params.state,
            ZipCode: $scope.params.ZipCode,
            project_type: $scope.params.project_type
        };

        //alert(postData.city);
        //alert(postData.media_url);
        apiService.post("Project/ProjectAddress", postData).then(function (response) {
            var loginSession = response.data;
              console.log("project done");
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();

        },
        function (error) {

        });

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'md'
            });
        }


        //uploadService.postDataAfterUpload(postData).then(function () {
        //    // Process the successful file upload
        //    alert("project Created");
        //}, function (error) {
        //    alert('Error creating');
        //})
    };



    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };


    uploader1.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };


    uploader2.onErrorItem = function (fileItem, response, status, headers) {
      console.log('Unable to upload file.');
    };

    uploader3.onErrorItem = function (fileItem, response, status, headers) {
       console.log('Unable to upload file.');
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
    uploader2.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };


    Url = "GetCSC/city";

    apiService.get(Url).then(function (response) {
        $scope.cities = response.data;

    },
function (error) {
    console.log("Error " + error.state);
});


    $scope.selectcity = function () {
        $scope.params.city = $scope.city1;
        //alert($scope.params.city);
    };


    Url = "GetCSC/state";

    apiService.get(Url).then(function (response) {
        $scope.states = response.data;

    },
function (error) {
    console.log("Error " + error.state);
});


    $scope.selectstate = function () {
        $scope.params.state = $scope.state1;
        //alert($scope.params.state);
    };


    $scope.selectapartment = function () {
        $scope.params.project_type ="Apartment"

        console.log($scope.params.project_type);
    };


    $scope.selecthome = function () {
        $scope.params.project_type ="Family And Home";
        console.log($scope.params.project_type);
    };

    $scope.selectvilla = function () {
        $scope.params.project_type = "Villa";
        console.log($scope.params.project_type);
    };

    $scope.selectplot = function () {
        $scope.params.project_type = "Plot";
        console.log($scope.params.project_type);
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
        name: $scope.name,
        city: $scope.city,
        street_2: $scope.street_2,
        state: $scope.state,
        ZipCode: $scope.ZipCode,
        project_type: $scope.project_type,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId')
    };

    var emp = {
        //id: $cookieStore.get('projectid'),
        name: $scope.name,
        city: $scope.city,
        street_2: $scope.street_2,
        state: $scope.state,
        ZipCode: $scope.ZipCode,
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

   $scope.reset = function() {
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