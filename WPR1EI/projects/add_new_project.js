var uploader_done = false;
var uploader1_done = false;
var uploader2_done = false;
var uploader3_done = false;


var ProjectPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $modal) {
    console.log('ProjectPopUpController');



    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-dev2.azurewebsites.net/MediaElement/upload'
    });

    var uploader1 = $scope.uploader1 = new FileUploader({
        url: 'https://dw-webservices-dev2.azurewebsites.net/MediaElement/upload'
    });
    var uploader2 = $scope.uploader2 = new FileUploader({
        url: 'https://dw-webservices-dev2.azurewebsites.net/MediaElement/upload'
    });
    var uploader3 = $scope.uploader3 = new FileUploader({
        url: 'https://dw-webservices-dev2.azurewebsites.net/MediaElement/upload'
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

        if (uploader_done == true && uploader1_done == true && uploader2_done == true && uploader3_done == true) {
            $scope.showProgress = false;
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
            $scope.showProgress = false;
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
            $scope.showProgress = false;
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
            $scope.showProgress = false;

            callApi();
          }
    };


    var called = false;
    callApi = function () {
        if (called == true){
            return;
        }

        called = true;

        var address = [];

        var newadd = {};

        if ($scope.choices2[0].Street_1 != undefined)
            newadd.Street_1 = $scope.choices2[0].Street_1;
        if ($scope.choices2[1].Street_1 != undefined)
            newadd.Street_2 = $scope.choices2[1].Street_1;
        if ($scope.choices2[2].Street_1 != undefined)
            newadd.Street_2 = $scope.choices2[1].Street_1 + " " + $scope.choices2[2].Street_1;
        


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
            Street_1: newadd.Street_1,
            Street_2: newadd.Street_2,
            media_type: "Logo",
            city: $scope.params.city,
            state: $scope.params.state,
            ZipCode:$scope.ZipCode,
            project_type: $scope.params.project_type,
            project_website: $scope.params.project_website,
            builder_website: $scope.params.builder_website

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


        var address = [];
        
        for (var i in $scope.choices2) {     

            var newadd = {};     
            newadd.Street_1 = $scope.choices2[i].Street_1;
         
            newadd.Street_2 = $scope.choices2[i].Street_2;
            address.push(newadd);
           
            
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
        //$scope.showProgress = false;
    };
    uploader1.onCompleteItem = function (fileItem, response, status, headers) {
        //$scope.showProgress = false;
    };
    uploader2.onCompleteItem = function (fileItem, response, status, headers) {
        //$scope.showProgress = false;
    };
    uploader3.onCompleteItem = function (fileItem, response, status, headers) {
        //$scope.showProgress = false;
    };


    //Audit log start															
    $scope.params =
        {
            device_os: $cookieStore.get('Device_os'),
            device_type: $cookieStore.get('Device'),
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "Contact",
            action_id: "Contact View",
            details: "AddNewProject",
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

    Url = "GetCSC/state";
    apiService.get(Url).then(function (response) {
        $scope.states = response.data;
    },
function (error) {
    alert("Error " + error.state);
});

    $scope.selectstate = function () {
        $scope.params.state = $scope.state1;
        //alert($scope.params.state);
    };


    Url = "GetCSC/city";
    apiService.get(Url).then(function (response) {
        $scope.cities = response.data;
    },
function (error) {
    alert("Error " + error.cities);


});

    $scope.filterExpression = function (city) {
        return (city.stateid === $scope.params.state);
    };


    $scope.selectcity = function () {
        $scope.params.city = $scope.city1;
        //alert($scope.params.city);
    };


    $scope.choices2 = [{ id: 'choice1' }];
    $scope.addNewChoice2 = function (e) {
        var classname = e.currentTarget.className;
        if (classname == 'remove-field') {
            var wrappedResult = angular.element(this);
            wrappedResult.parent().remove();
            $scope.choices2.pop();
        }
        else if ($scope.choices2.length < 3) {
            var newItemNo2 = $scope.choices2.length + 1;
            $scope.choices2.push({ 'id': 'choice' + newItemNo2 });
        }

    };

   
  
 
    $scope.selectedproject = -1;

    $scope.selectapartment = function () {
        $scope.params.project_type = "Apartment";
        $scope.selectedproject = 0;
        console.log($scope.params.project_type);
    };


    $scope.selecthome = function () {
        $scope.params.project_type = "Family And Home";
        $scope.selectedproject = 1;
        console.log($scope.params.project_type);
    };

    $scope.selectvilla = function () {
        $scope.params.project_type = "Villa";
        $scope.selectedproject = 2;
        console.log($scope.params.project_type);
    };

    $scope.selectplot = function () {
        $scope.params.project_type = "Plot";
        $scope.selectedproject = 3;
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


    //$scope.params = {
    //    name: $scope.name,
    //    city: $scope.city,
    //    Street_2: $scope.Street_2,
    //    state: $scope.state,
    //    ZipCode: $scope.ZipCode,
    //    project_type: $scope.project_type,
    //    project_website: $scope.project_website,
    //    builder_website: $scope.builder_website,
    //    organization_id: $cookieStore.get('orgID'),
    //    User_ID: $cookieStore.get('userId')
    //};

    var emp = {
        //id: $cookieStore.get('projectid'),
        name: $scope.name,
        city: $scope.city,
        Street_1: $scope.Street_1,
        Street_2: $scope.Street_2,
        state: $scope.state,
        ZipCode: $scope.ZipCode,
        project_type: $scope.project_type,
        project_website: $scope.project_website,
        builder_website: $scope.builder_website,
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


            if (uploader.queue.length != 0)
                uploader.uploadAll();
            if (uploader1.queue.length != 0)
                uploader1.uploadAll();
            if (uploader2.queue.length != 0)
                uploader2.uploadAll();
            if (uploader3.queue.length != 0)
                uploader3.uploadAll();
           
                uploader4.uploadAll();
            if (uploader.queue.length == 0 && uploader1.queue.length == 0 && uploader2.queue.length == 0 && uploader3.queue.length == 0 )
                $scope.finalpost();
            
        


            $scope.showValid = false;

        }

    }

};