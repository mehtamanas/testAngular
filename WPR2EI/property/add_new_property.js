
var PropertyPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService) {
    console.log('PropertyPopUpController');

    var uploader = $scope.uploader = new FileUploader({
        url: apiService.baseUrl +'MediaElement/upload'
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
            name: $scope.params.name,
            address: $scope.params.address,
            state: $scope.params.state,
            project_id: $scope.params.project_id,
            city: $scope.params.city,
            zip_code: $scope.params.zip_code,
        };





        //alert(postData.city);
        //alert(postData.media_url);
        apiService.post("PropertyListing/CreateProperty", postData).then(function (response) {
            var loginSession = response.data;
            alert("Property done");
            $modalInstance.dismiss();

        },
        function (error)
        {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        });
    };


    uploader.onErrorItem = function (fileItem, response, status, headers) {
        alert('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };







    $scope.params = {
        
        name: $scope.name,
        state: $scope.state,
        project_id: $scope.project_id,
        city: $scope.city,
        address: $scope.address,
        zip_code: $scope.zip_code,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId'),


    };

    


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error)
   {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
        //alert($scope.params.project_id);
    };



    Url = "GetCSC/state";
    apiService.get(Url).then(function (response) {
        $scope.states = response.data;
    },
function (error)
{
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
});

    $scope.selectstate = function () {
        $scope.params.state = $scope.state1;
        //alert($scope.params.state);
    };


    Url = "GetCSC/city";
    apiService.get(Url).then(function (response) {
        $scope.cities = response.data;
    },
function (error)
{
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");

});

    //Audit log start															
    $scope.params =
        {
            device_os: $cookieStore.get('Device_os'),
            device_type: $cookieStore.get('Device'),
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "Contact",
            action_id: "Contact View",
            details: "AddNewProperty",
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
   function (error)
   {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });
    };
    AuditCreate($scope.params);

    //end


    $scope.selectcity = function () {
        $scope.params.city = $scope.city1;
        //alert($scope.params.city);
    };

    $scope.addNew = function (isValid) {
                $scope.showValid = true;
                if (isValid) {

                    //alert("hi");
                    new ProjectCreate($scope.params).then(function (response) {
                        console.log(response);
                        $scope.showValid = false;
                        $state.go('guest.signup.thanks');
                    }, function (error) {
                        console.log(error);
                    });

                    $scope.showValid = false;

                }

            }

        };
