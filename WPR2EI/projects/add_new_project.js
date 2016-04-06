var uploader_done = false;
var uploader1_done = false;
var uploader2_done = false;
var uploader3_done = false;


var ProjectPopUpController = function ($scope, $state, $cookieStore, $window,apiService, $modalInstance, FileUploader, uploadService, $modal, $rootScope) {
    console.log('ProjectPopUpController');
    $scope.loadingDemo = false;
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,

    });

    var uploader1 = $scope.uploader1 = new FileUploader({
        url: apiService.uploadURL,

    });
    var uploader2 = $scope.uploader2 = new FileUploader({
        url: apiService.uploadURL,

    });
    var uploader3 = $scope.uploader3 = new FileUploader({
        url: apiService.uploadURL,

    });

    $scope.showProgress = false;


    getApi = function () {

    };




    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // FILTERS
    uploader1.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // FILTERS
    uploader2.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // FILTERS
    uploader3.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    //single select of image
    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader.queue.length > 1) {
            uploader.removeFromQueue(0);
        }
    }
    uploader1.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader1.queue.length > 1) {
            uploader1.removeFromQueue(0);
        }
    }
    uploader2.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader2.queue.length > 1) {
            uploader2.removeFromQueue(0);
        }
    }
    uploader3.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader3.queue.length > 1) {
            uploader3.removeFromQueue(0);
        }
    }
    // end of select of image


    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // alert("uploader called");
        $scope.media_url1 = response[0].Location;
        uploader_done = true;

        if (uploader_done == true && uploader1_done == true && uploader2_done == true && uploader3_done == true) {
            $scope.showProgress = false;
            $scope.finalpost();
        }

    };



    // CALLBACKS
    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        console.log("uploader1 called");
        $scope.media_url2 = response[0].Location;
        uploader1_done = true;
        if (uploader_done == true && uploader1_done == true && uploader2_done == true && uploader3_done == true) {
            $scope.showProgress = false;
            $scope.finalpost();
        }
    };

    // CALLBACKS
    uploader2.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        console.log("uploader2 called");
        $scope.media_url3 = response[0].Location;
        uploader2_done = true;
        if (uploader_done == true && uploader1_done == true && uploader2_done == true && uploader3_done == true) {
            $scope.showProgress = false;
            $scope.finalpost();
        }
    };


    // CALLBACKS

    uploader3.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        console.log("uploader3 called");
        $scope.media_url4 = response[0].Location;
        uploader3_done = true;
        if (uploader_done == true && uploader1_done == true && uploader2_done == true && uploader3_done == true) {
            $scope.showProgress = false;
            $scope.finalpost();
        }
    };


    var called = false;

    $scope.finalpost = function () {
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
            //else if (i == 2) {
            //    if ($scope.choices2[2].Street_1 != undefined)
            //        newadd.Street_2 = $scope.choices2[1].Street_1 + " " + $scope.choices2[2].Street_1;
            //}

        }


        // TODO: Need to get these values dynamically
        var postData = {
            userid: $cookieStore.get('userId'),
            name: $scope.params.name,
            organization_id: $cookieStore.get('orgID'),
            //media_logo_name: uploadResult.Name,
            media_url1: $scope.media_url1,
            //media_home_name: uploadResult1.Name,
            media_url2: $scope.media_url2,
            //media_project_name: uploadResult2.Name,
            media_url3: $scope.media_url3,
            // media_name: uploadResult.Name,
            media_url4: $scope.media_url4,
            possession_date: $scope.params.month,
            total_area: $scope.params.totalProjectArea,
            year: $scope.params.project_year,
            class_type: "Project",
            Street_1: newadd.Street_1,
            Street_2: newadd.Street_2,
            area: $scope.params.area,
            media_type: "Logo",
            city: $scope.params.city,
            state: $scope.params.state,
            Rangefrom: $scope.params.Rangefrom,
            Rangeto: $scope.params.Rangeto,
            ZipCode: $scope.ZipCode,
            project_type: $scope.params.project_type,
            project_website: $scope.params.project_website,
            builder_website: $scope.params.builder_website,
            lat1: $scope.params.lat1,
            long1: $scope.params.long1


        };

        //alert(postData.city);
        //alert(postData.media_url);
        apiService.post("Project/ProjectAddress", postData).then(function (response) {
            var loginSession = response.data;
            AuditCreate();
            $scope.loadingDemo = false;
            console.log("project done");
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'projectGrid');
            called = true;
            uploader_done = false;
            uploader1_done = false;
            uploader2_done = false;
            uploader3_done = false;

            var media = [];

            var postData_fb =
               {

                   user_id: $cookieStore.get('userId'),
                   organization_id: $cookieStore.get('orgID'),
                   class_id: loginSession.id,
                   class_type: "Project",
                   element_type: "project_facebook",
                   element_info1: $scope.params.facebook,
               }
            media.push(postData_fb);

            var postData_twitter =
                {

                    user_id: $cookieStore.get('userId'),
                    organization_id: $cookieStore.get('orgID'),
                    class_id: loginSession.id,
                    class_type: "Project",
                    element_type: "project_twitter",
                    element_info1: $scope.params.twitter,
                }
            media.push(postData_twitter);

            var postData_linkedin =
               {
                   user_id: $cookieStore.get('userId'),
                   organization_id: $cookieStore.get('orgID'),
                   class_id: loginSession.id,
                   class_type: "Project",
                   element_type: "project_linkedin",
                   element_info1: $scope.params.linkedin,
               }
            media.push(postData_linkedin);

            apiService.post("ElementInfo/Create", media).then(function (response) {
                var loginSession = response.data;
                called = true;

            },
           function (error) {
               if (error.status === 400)
                   alert(error.data.Message);
               else
                   alert("Network issue");

           });

        },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        });



        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'sm',
                resolve: { items: { title: "Project" } }
            });
        }


        var address = [];

        for (var i in $scope.choices2) {

            var newadd = {};
            newadd.Street_1 = $scope.choices2[i].Street_1;

            newadd.Street_2 = $scope.choices2[i].Street_2;
            address.push(newadd);


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



    //  Audit log start 

    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "CreateProject",
           action_id:  "CreateProject View",
           details: $scope.params.name + "CreateProjectView",
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


  //  $scope.params.project_type = "Apartment";
  //  $scope.selectedproject = 0;


    Url = "GetCSC/state";
    apiService.get(Url).then(function (response) {
        $scope.states = response.data;
    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    
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
    if (error.status === 400)
        alert(error.data.Message);
   
});

    $scope.filterExpression = function (city) {
        return (city.stateid === $scope.params.state);
    };


    $scope.selectcity = function () {
        $scope.params.city = $scope.city1;
        //alert($scope.params.city);
    };


    Url = "GETCSC/GetMonth";

    apiService.get(Url).then(function (response) {
        $scope.month = response.data;

    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
   
});

    $scope.selectmonth = function () {
        $scope.params.month = $scope.month1;
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


    $scope.choices2 = [{ id: 'choice1' }];
    $scope.addNewChoice2 = function (e) {
        var classname = e.currentTarget.className;
        if (classname == 'remove-field') {
            var wrappedResult = angular.element(this);
            wrappedResult.parent().remove();
            $scope.choices2.pop();
        }
        else if ($scope.choices2.length < 2) {
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


    $scope.CanceUpload = function () {
        uploader.cancelAll();
        uploader1.cancelAll();
        uploader2.cancelAll();
        uploader3.cancelAll();
        console.log("UploadCancelled");
    }



    var emp = {
        //id: $cookieStore.get('projectid'),
        name: $scope.name,
        city: $scope.city,
        Street_1: $scope.Street_1,
        Street_2: $scope.Street_2,
        area: $scope.area,
        state: $scope.state,
        ZipCode: $scope.ZipCode,
        Rangefrom: $scope.Rangefrom,
        Rangeto: $scope.Rangeto,
        lat1: $scope.lat1,
        long1: $scope.long1,
        possession_date: $scope.month,
        project_type: $scope.project_type,
        project_website: $scope.project_website,
        builder_website: $scope.builder_website,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId'),
        facebook: $scope.facebook,
        twitter: $scope.twitter,
        linkedin: $scope.linkedin,
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
            $scope.loadingDemo = true;

            if (uploader.queue.length != 0)
                uploader.uploadAll();
            if (uploader1.queue.length != 0)
                uploader1.uploadAll();
            if (uploader2.queue.length != 0)
                uploader2.uploadAll();
            if (uploader3.queue.length != 0)
                uploader3.uploadAll();
            if (uploader.queue.length == 0 && uploader1.queue.length == 0 && uploader2.queue.length == 0 && uploader3.queue.length == 0)
                $scope.finalpost();




            $scope.showValid = false;

        }

    }

};