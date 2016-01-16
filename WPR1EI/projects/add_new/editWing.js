﻿pushedUnit = [];
insert = true;
validated = true;
var newUnit = {};
var split;
upload;

var EditNewWingController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $modal, $rootScope) {
    console.log('EditNewWingController');

    var wing_id = $cookieStore.get('wing_id');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');

    var uploader = $scope.uploader = new FileUploader({
       url: apiService.uploadURL,
       
    });

    var uploader1 = $scope.uploader1 = new FileUploader({
       url: apiService.uploadURL,
       
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

    uploader1.filters.push({
        name: 'imageFilter1',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|x-zip-compressed|'.indexOf(type) !== -1;
        }
    });


    projectUrl = "WingType/GetfloorMultiple?id=" + wing_id;

    //alert(projectUrl);
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.floors = response.data;

    },
function (error) {
    console.log("Error " + error.state);
}
    );

    projectUrl = "WingType/GetWingSingle?id=" + wing_id;

    //alert(projectUrl);
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data[0];

    },
function (error) {
    console.log("Error " + error.state);
}
    );




    var upload1 = 0;
    var upload2 = 0;
    $scope.media1 = "";
    $scope.media2 = "";

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


    uploader.onSuccessItem = function (fileItem, response, status, headers) {

        uploadResult = response[0];
        // post image upload call the below api to update the database
        upload1 = 1;
        $scope.media1 = uploadResult.Location;

        if (upload1 == 1 && upload2 == 1) {
            //pushedUnit = [];
            //insert = true;
            //validated = true;
            //var newUnit = {};
            //var split;
            //upload;
            //checkUnitValidity();
            $scope.showProgress = false;
            $scope.finalpost();
        }
    };


    $scope.blur = function () {
        var array = convertToArray($(this).val());
        console.log(array);
        if (isValidFormat.isValidFormat(array) || $(this).val() == "") {
            $(this).attr("data-valid", 1);
            $(this).next().remove();
        }
        else {
            if ($(this).next().hasClass("error")) {
                $(this).next().remove();
                alert("Data Format Invalid! ");
                $(this).attr("data-valid", 0);
                return;
            }
        }
        if ($scope.isInInterval(array) && isValidFormat(array)) {
            $(this).attr("data-valid", 1);
            $(this).next().remove();
        }
        else if (!$scope.isInInterval(array) && isValidFormat(array)) {
            if ($(this).next().hasClass("error")) {
                $(this).next().remove();
                alert("Numbers Outside Interval! ");
                return;
            }
        }

    };

    $scope.submit = function (e) {

        var array = [];
        for (var i in $scope.floors) {
            if ($scope.floors[i].no_of_units != null) {
                var testArray = $scope.convertToArray($scope.floors[i].no_of_units);
                Array.prototype.push.apply(array, testArray);
            }
        };
        $(this).nextAll().remove();
        if ($scope.isDuplicate(array)) {
            //var result = $scope.isDuplicate(array);
            alert("Duplicate numbers! ");
            return;
        }
        if ($scope.isMissingNumber(array)) {
            var nums = $scope.isMissingNumber(array);
            alert("Missing numbers! " + nums);
            return;
        }

        if ($scope.invalid(array)) {
            var nums = $scope.invalid(array);
            alert("Ivalid Range! " + nums);
            return;
        }
        if (!$scope.isDuplicate(array) && !$scope.isMissingNumber(array)) {

            showProgress = true;
            uploader.uploadAll();
            uploader1.uploadAll();

        }
    };


    $scope.isArray = function (myArray) {
        return myArray.constructor.toString().indexOf("Array") > -1;
    }
    $scope.convertToArray = function (string) {
        var dot = string.indexOf(".");
        var array = string.split(",");
        if (dot != -1)
            array.push("!");
        var reg = /\d\-\d/;
        for (var i = 0; i < array.length; i++) {
            if (reg.test(array[i])) {
                array[i] = array[i].split("-");
            }
        }
        for (var i = 0; i < array.length; i++) {
            if ($scope.isArray(array[i])) {
                if (parseInt(array[i][0]) == parseInt(array[i][1])) {
                    array.push(parseInt(array[i][0]));
                    array.push(parseInt(array[i][0]));
                }
                else if (parseInt(array[i][0]) > parseInt(array[i][1])) {
                    array.push("!");
                }
                else
                    for (var u = parseInt(array[i][0]) ; u <= parseInt(array[i][1]) ; u++) {
                        array.push(parseInt(u));
                    }
                array.splice(i, 1);
                i--;
            }
            else {
                if ($.isNumeric(array[i]))
                    array[i] = parseInt(array[i]);
            }
        }
        return array;
    }
    $scope.isValidFormat = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (!$.isNumeric(array[i]))
                return false;
        }
        return true;
    }
    $scope.isInInterval = function (array) {
        var a = parseInt($scope.params.total_no_of_floors);
        for (var i = 0; i < array.length; i++) {
            if (array[i] < 1 || array[i] > a)
                return false;
        }
        return true;
    }
    $scope.isDuplicate = function (array) {
        var array = array.sort();
        var result = [];
        for (var i = 0; i < array.length - 1; i++) {
            if (array[i] == array[i + 1]) {
                if (result.indexOf(array[i]) == -1)
                    result.push(array[i + 1]);
            }
        }
        if (result.length)
            return result;
        else
            return false;
    }
    $scope.isMissingNumber = function (array) {
        var a = parseInt($scope.params.total_no_of_floors);
        var result = false;
        var nums = [];
        for (var i = 1; i <= a; i++) {
            for (var u = 0; u < array.length; u++) {
                if (i == array[u]) {
                    result = true;
                    break;
                }
                else
                    result = false;
            }
            if (result == false) {
                if (nums.indexOf(i) == -1)
                    nums.push(i);
            }

        }
        if (nums.length)
            return nums;
        else
            return false;
    }


    $scope.invalid = function (array) {
        var a = parseInt($scope.params.total_no_of_floors);
        var result = false;
        var nums = [];

        for (var u = 0; u < array.length; u++) {

            if (array[u] > a) {

                nums.push(array[u]);
            }

        }
        if (nums.length)
            return nums;
        else
            return false;
    }
    /// CALLBACKS
    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        uploadResult1 = response[0];
        $scope.media2 = uploadResult1.Location;
        // TODO: Need to get these values dynamically
        upload2 = 1;
        if (upload1 == 1 && upload2 == 1) {
            //pushedUnit = [];
            //insert = true;
            //validated = true;
            //var newUnit = {};
            //var split;
            //upload;
            //checkUnitValidity();
            $scope.showProgress = false;
            $scope.finalpost();
        }

    };
    //validation start
    //var checkUnitValidity = function () {

    //    for (var i in $scope.floors) { //for each boxes(units)

    //        if (validated == false) {
    //            break;
    //        }
    //        newUnit.no_of_units = $scope.floors[i].no_of_units;
    //        if (newUnit.no_of_units != null) {
    //            if (newUnit.no_of_units.indexOf(","))
    //                split = $scope.floors[i].no_of_units.split(",");//split value of each box by comma

    //            for (var j = 0; j < split.length; j++)//for each set in split
    //            {
    //                var x = split[j].indexOf("-");//in case the set contains the - then split it again before pusing it
    //                if (x != -1) {
    //                    var splitAgain;
    //                    splitAgain = split[j].split("-");

    //                    for (var y = splitAgain[0]; y <= splitAgain[1]; y++) {//insert all the numbers of slitAgain Range(ie set with "-")
    //                        validate(y);
    //                    }
    //                }
    //                else {
    //                    validate(split[j]);
    //                }
    //            }
    //        }
    //    }

    //    if (pushedUnit.length > $scope.params.total_no_of_floors) {//to check if unitset/pushed unit contains more numbers then the unit_no 
    //        validated = false;
    //        upload = 2;
    //        alert("not validated");
    //    }
    //    var found;
    //    for (var m = 0; m < $scope.params.total_no_of_floors; m++) {// to check if all the items of unit are present in the pushed_unit
    //        found = false;
    //        for (var n = 0; n < pushedUnit.length; n++) {
    //            if (m == pushedUnit[n]) {
    //                found = true;
    //                break;
    //            }
    //        }
    //        if (found == false && n == pushedUnit.length) {
    //            validated = false;
    //            upload = 2;
    //            alert("not validated");
    //        }

    //    }
    //}

    //var validate = function (x) {
    //    for (var k = 0; k < pushedUnit.length; k++)//validation before pushing the value into array
    //    {
    //        if (x == pushedUnit[k]) {
    //            insert = false;
    //            alert("not validated");
    //            break;
    //        }
    //    }

    //    if (pushedUnit.length == 0 && insert == true)
    //        pushedUnit[pushedUnit.length] = x;
    //    else if (insert == true && k == pushedUnit.length)
    //        pushedUnit[pushedUnit.length] = x;
    //    else if (insert == false) {
    //        validated = false;
    //        upload = 2;
    //    }

    //}
    //validation end

    $scope.finalpost = function () {
        // TODO: Need to get these values dynamically

        var postData = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            media_name: "",
            Image_Url_wing1:$scope.media1  ,
            // media_name: uploadResult1.Name,
            Image_Url_wing2: $scope.media2,
            class_type: "Project",
            media_type: "Logo",
            wing_name: $scope.params.wing_name,
            total_no_of_floors: $scope.params.total_no_of_floors,
            wing_id: wing_id

        };

     
        apiService.post("WingType/EditWingFloor", postData).then(function (response) {
            var loginSession = response.data;
            var towerupdate = [];
            for (var i in $scope.floors) {
                var newTower = {};
                newTower.no_of_units = $scope.floors[i].no_of_units;
                newTower.wing_id = wing_id;
                newTower.floor_id = $scope.floors[i].floor_id;
                towerupdate.push(newTower);
            }
            apiService.post("WingType/EditWingFloor1", towerupdate).then(function (response) {
                var loginSession = response.data;
                //     alert("Floor Updated...");
                $modalInstance.dismiss();

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
                    resolve: { items: { title: "Wing Editing" } }
                });

                $rootScope.$broadcast('REFRESH', 'wing');
            };

            $modalInstance.dismiss();
            $scope.openSucessfullPopup();

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



}

$scope.CanceUpload = function () {
    uploader.cancelAll();
    uploader1.cancelAll();
    
    console.log("UploadCancelled");
}
uploader.onErrorItem = function (fileItem, response, status, headers) {
    console.log('Unable to upload file.');
};


uploader1.onErrorItem = function (fileItem, response, status, headers) {
    console.log('Unable to upload file.');
};


uploader.onCompleteItem = function (fileItem, response, status, headers) {
    //$scope.showProgress = false;
};
uploader1.onCompleteItem = function (fileItem, response, status, headers) {
    //$scope.showProgress = false;


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
            details: "EditWing",
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
        wing_name: $scope.wing_code,
        total_no_of_floors: $scope.total_no_of_floors,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId')
    };

    var emp = {
        //id: $cookieStore.get('projectid'),
        wing_name: $scope.wing_name,
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

    $scope.addNew = function () {
        $scope.showValid = true;
        //$scope.submit();

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

    };

};