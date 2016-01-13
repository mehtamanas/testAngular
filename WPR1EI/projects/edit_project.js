var uploader_done = false;
var uploader1_done = false;
var uploader2_done = false;
var uploader3_done = false;


var EditProjectController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, $window, uploadService, $modal) {
    console.log('EditProjectController');

   

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
    var uploader3 = $scope.uploader3 = new FileUploader({
        url: 'https://dw-webservices-uat.azurewebsites.net/MediaElement/upload',
        queueLimit: 1
    });

    $scope.showProgress = false;


    getApi = function () {

    };

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;



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
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
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

    // FILTERS
    uploader3.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
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
        if (called == true) {
            return;
        }
        var address = [];

        var newadd = {};

        for (i = 0; i < $scope.choices2.length; i++) {
            if (i == 0) {
                if ($scope.choices2[0].Street_1 != undefined)
                    newadd.Street_1 = $scope.choices2[0].Street_1;
            }
            else if (i == 1) {
                if ($scope.choices2[1].Street_1 != undefined)
                    newadd.Street_2 = $scope.choices2[1].Street_1;
            }
            else if (i == 2) {
                if ($scope.choices2[2].Street_1 != undefined)
                    newadd.Street_2 = $scope.choices2[1].Street_1 + " " + $scope.choices2[2].Street_1;
            }

        }


        called = true;
        // TODO: Need to get these values dynamically
        var postData = {
            id:$scope.seletedCustomerId,
            userid: $cookieStore.get('userId'),
            Name: $scope.params.Project_name,
            organization_id: $cookieStore.get('orgID'),
            media_logo_name: uploadResult.Name,
            media_url1: uploadResult.Location,
            //media_home_name: uploadResult1.Name,
            media_url2: uploadResult1.Location,
            //media_project_name: uploadResult2.Name,
            media_url3: uploadResult2.Location,
            // media_name: uploadResult.Name,
            media_url4: uploadResult3.Location,
            possasion_month: $scope.params.possasion_month,
            year: $scope.params.project_year,
            project_website: $scope.params.project_website,
            builder_website: $scope.params.builder_website,
            total_area: $scope.params.total_project_area,
            city_id: $scope.params.city,
            state_id: $scope.params.state,
            monthid: $scope.month1,
            class_type: "Project",
            Street_1: newadd.Street_1,
            //Street_2: newadd.Street_2,
            media_type: "Logo",
            month: $scope.params.monthid,
            city: $scope.params.city,
            state: $scope.params.state,
            lat1: $scope.params.lat1,
            long1: $scope.params.long1,
            ZipCode: $scope.params.ZipCode,
            project_type: $scope.params.project_type,
            
        };
       
        apiService.post("Project/Edit", postData).then(function (response) {
            var loginSession = response.data;
           // console.log("project Edit done");
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
                size: 'md',
                resolve: { items: { title: "Project" } }
            });
        }
      
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
            details: "EditProject",
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

    $scope.filterExpression = function (city) {
        return (city.stateid === $scope.params.state);
    };


    Url = "GETCSC/GetMonth";

    apiService.get(Url).then(function (response) {
        $scope.month = response.data;

    },
function (error) {
    alert("Error " + error.state);
});

    $scope.selectmonth = function () {
        $scope.params.monthid = $scope.month1;
        //alert($scope.params.month);
    };

    var min = new Date().getFullYear() - 10,
    max = new Date().getFullYear() + 9;
    $scope.years = [];
    for (i = min ; i < max; i++) {
        $scope.years.push(i);
    }

    $scope.selectyear = function () {
        $scope.params.project_year = $scope.year1;
        //alert($scope.params.month);
    };



    $scope.selectedproject = 3;

    $scope.selectapartment = function () {
        $scope.params.project_type = "Apartment"
        $scope.selectedproject = 4;
        console.log($scope.params.project_type);
    };


    $scope.selecthome = function () {
        $scope.params.project_type = "Family And Home";
        $scope.selectedproject = 5;
        console.log($scope.params.project_type);
    };

    $scope.selectvilla = function () {
        $scope.params.project_type = "Villa";
        $scope.selectedproject = 6;
        console.log($scope.params.project_type);
    };

    $scope.selectplot = function () {
        $scope.params.project_type = "Plot";
        $scope.selectedproject = 7;
        console.log($scope.params.project_type);
    };


   
    projectUrl = "Project/GetByProjectIdnew/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data[0];
        $scope.choices2[0].Street_1 = response.data[0].Street_1;
        $scope.choices2[0].Street_2 = response.data[0].Street_2;
        $scope.state1 = response.data[0].State_id;
        $scope.params.state = response.data[0].State_id;
        $scope.city1 = response.data[0].city_id;
        $scope.params.city = response.data[0].city_id;
        $scope.month1 = response.data[0].possasion_month;
        $scope.year1 = response.data[0].year;
        if (response.data[0].project_type == "Family And Home") $scope.selecthome();
        if (response.data[0].project_type == "Villa") $scope.selectvilla();
        if (response.data[0].project_type == "Plot") $scope.selectplot();
        if (response.data[0].project_type == "Apartment") $scope.selectapartment();
    },

function (error) {
    console.log("Error " + error.state);
}
    );

    $scope.params = {

        Name: $scope.Project_name,
        builder_website: $scope.builder_website,
        Street_1: $scope.Street_1,
        Street_2: $scope.Street_2,
        city_id: $scope.city_id,
        state_id: $scope.state_id,
        monthid: $scope.monthid,
        month:$scope.month,
        city: $scope.city,
        state: $scope.state,
        project_type: $scope.project_type,
        project_year: $scope.project_year,
        total_project_area: $scope.total_project_area,
        project_website: $scope.project_website,
        ZipCode: $scope.ZipCode,
        lat1: $scope.lat1,
        long: $scope.long1,
        possasion_month: $scope.possasion_month,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId')

    };
    

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


            $scope.showValid = false;

        }

    }

};