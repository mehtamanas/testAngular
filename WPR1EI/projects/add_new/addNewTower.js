var AddNewTowerController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $modal, $rootScope) {
    console.log('AddNewTowerController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');

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
     //uploadResult = response[0];
        // post image upload call the below api to update the database
     upload1 = 1;
     $scope.media1 = response[0].Location;
     if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
         $scope.finalpost()
     }

    };

    // CALLBACKS
    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        //uploadResult1 = response[0];

        upload2 = 1;
        $scope.media2 = response[0].Location;
        if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
            $scope.finalpost()
        }
    };


    // CALLBACKS
    uploader2.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        //uploadResult2 = response[0];

        upload3 = 1;
        $scope.media3 = response[0].Location;
        if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
            $scope.finalpost()
        }

    };

 

    var called = false;
    $scope.finalpost = function ()
    {
        if (called == true) {
            return;
        }
        var upload1 = 0;
        var upload2 = 0;
        var upload3 = 0;

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
        var totfound = 0;
        for (var i in $scope.wings) {

            alert($scope.wings[i].total_no_of_floors_new);
            if ($scope.wings[i].total_no_of_floors_new != null) {
                fnd = 1;
                totfound = totfound+1;

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
                called = true;
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
                
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

    $scope.submit = function ()
    {
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