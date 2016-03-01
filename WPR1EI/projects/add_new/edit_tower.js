var AddEditTowerController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $modal, $rootScope) {
    console.log('AddEditTowerController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    var tower_id = $cookieStore.get('tower_id');
   // var tower_id = $cookieStore.get('tower_id');

    var uploader = $scope.uploader = new FileUploader({
       url: apiService.uploadURL,
       
    });

    var uploader1 = $scope.uploader1 = new FileUploader({
       url: apiService.uploadURL,
        
    });
    var uploader2 = $scope.uploader2 = new FileUploader({
       url: apiService.uploadURL,
        
    });


    $scope.showProgress = false;

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
            var im = '||x-zip-compressed|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '||x-zip-compressed|'.indexOf(type) !== -1;
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




    projectUrl = "Tower/GetMultipleWingTypebyTowerId?id=" + tower_id;
  
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.wings = response.data;


    },
function (error)
{
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
} );


    projectUrl = "Tower/GetTowerByTower/" + tower_id;
    
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data[0];


    },
function (error)
{
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
});

    



    var upload1 = 0;
    var upload2 = 0;
    var upload3 = 0;
    $scope.media1 = "";
    $scope.media2 = "";
    $scope.media3 = "";
    // CALLBACKS

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

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
       
        // post image upload call the below api to update the database
        upload1 = 1;
        $scope.params.Image_Url_Tower1 = response[0].Location;
        if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
            $scope.showProgress = false;
            $scope.finalpost()
        }

    };

    // CALLBACKS
    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        $scope.params.Image_Url_Tower3Dzip = response[0].Location;

        upload2 = 1;
       
        if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
            $scope.showProgress = false;
            $scope.finalpost()
        }
    };


    // CALLBACKS
    uploader2.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        $scope.params.Image_Url_Minimap = response[0].Location;

        upload3 = 1;
        
        if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
            $scope.showProgress = false;
            $scope.finalpost()
        }

    };

    var called = false;
    $scope.finalpost = function ()
    {
        if (called == true) {
            return;
        }

        // TODO: Need to get these values dynamically
        var postData = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            media_name: "",
            Image_Url_Tower1: $scope.params.Image_Url_Tower1,
            // media_name: uploadResult1.Name,
            Image_Url_Tower3Dzip: $scope.params.Image_Url_Tower3Dzip,
            Image_Url_Minimap: $scope.params.Image_Url_Minimap,
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


        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/Edited.tpl.html',
                backdrop: 'static',
                controller: EditsucessfullController,
                size: 'md',
                resolve: { items: { title: "Tower" } }
            });

            $rootScope.$broadcast('REFRESH', 'tower');
        };


        var fnd = 0;
        var totfound = 0;
        for (var i in $scope.wings) {

            if ($scope.wings[i].wing_no != null && $scope.wings[i].wing_no != "") {
                fnd = 1;
                totfound = totfound + 1;
            }
        }
        if (fnd == 0) {
            alert("No Wing Mapped.....");
           return;
        }
        if (parseInt($scope.params.no_of_wings) != parseInt(totfound)) {
            alert("Number Of wings not assigned properly...");
            return;
        }

        apiService.post("Tower/EditTowerWing", postData).then(function (response) {
            var loginSession = response.data;
            AuditCreate();
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
                called = true;
            },
            function (error)
            {
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });

            //  alert("Tower Done...");
            $modalInstance.dismiss();

        },
        function (error)
        {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        });



      
    }

    $scope.CanceUpload = function () {
        uploader.cancelAll();
        uploader1.cancelAll();
        uploader2.cancelAll();
        
        console.log("UploadCancelled");
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

    $scope.submit = function () {
        if (uploader.queue.length != 0)
            uploader.uploadAll();
        if (uploader1.queue.length != 0)
            uploader1.uploadAll();
        if (uploader2.queue.length != 0)
            uploader2.uploadAll();
        if (uploader.queue.length == 0 && uploader1.queue.length == 0 && uploader2.queue.length == 0)
            $scope.finalpost();
    }


    //Audit log start															
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "Edit View",
           details: $scope.params.tower_name + "EditTower",
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

  

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid)
        {

            $scope.submit();
          

            $scope.showValid = false;

        }

    }

};