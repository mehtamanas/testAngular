
var EditUserPopUpController = function ($scope, $state, $modalInstance, $cookieStore, apiService, $modal, $window, FileUploader, uploadService) {
    console.info("EditUserPopUpController");

    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
    });

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    if ($scope.seletedCustomerId !== '') {

        
        GetUrl = "User/GetUserDetails/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;


        apiService.get(GetUrl).then(function (response) {

            $scope.data = response.data;
          // alert($scope.seletedCustomerId);

            $scope.organization_id = $scope.data[0].organization_id;
           
            $scope.first_name = $scope.data[0].first_name;
            $scope.last_name = $scope.data[0].last_name;
            $scope.account_email = $scope.data[0].account_email;
            $scope.account_phone = $scope.data[0].account_phone;
            $scope.street_1 = $scope.data[0].street_1;
            $scope.role_name = $scope.data[0].role_name;
            $scope.zip_code = $scope.data[0].zip_code;
            $scope.state = $scope.data[0].state;
            $scope.city = $scope.data[0].city;
            if ($scope.data.contact_mobile !== '') {
                $scope.mobile = $scope.data.contact_mobile;
            }
            if ($scope.data.contact_email !== '') {
                $scope.email = $scope.data.contact_Email;
            }
        },
                    function (error) {
                        deferred.reject(error);
                        alert("not working");
                    });
    }

    $scope.params = {
        first_name: $scope.first_name,
        last_name: $scope.last_name,
        account_email: $scope.account_email,
        account_phone: $scope.account_phone,
        role_name: $scope.role_name,
        street_1: $scope.street_1,
        zip_code: $scope.zip_code,
        state: $scope.state,
        city: $scope.city,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId'),



    };




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


    Url = "Role/Get/";
    apiService.get(Url).then(function (response) {
        $scope.roles = response.data;
    },


    function (error) {
        alert("Error " + error.roles);

    });

    $scope.selectrole = function () {
        $scope.params.role_name = $scope.role_name1;
    };


    Url = "GetCSC/city";
    apiService.get(Url).then(function (response) {
        $scope.cities = response.data;
    },


    function (error) {
        alert("Error " + error.cities);

    });

    $scope.selectcity = function () {
        $scope.params.city = $scope.city1;
        //alert($scope.params.city);
    };


    $scope.reset = function () {
        $scope.params = {};
    }

    
    $scope.addNew = function (isValid) {
        // alert("Hi in add new function");
        $scope.showValid = true;
        //   new OrgEdit($scope.params);
        if (isValid) {

            $scope.showValid = false;

        }
    };


    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    uploader.onErrorItem = function (fileItem, response, status, headers) {
        alert('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };


    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        var uploadResult = response[0];

        // TODO: Need to get these values dynamically
        var postData = {



            // media_name: uploadResult.media_name,
            media_url: uploadResult.Location,
            class_type: "Organization",
            organization_id: $cookieStore.get('orgID'),
            User_ID: $cookieStore.get('userId'),
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            account_email: $scope.account_email,
            account_phone: $scope.account_phone,
            role_name: $scope.role_name,
            street_1: $scope.street_1,
            zip_code: $scope.zip_code,
            state: $scope.state,
            city: $scope.city


        };
        
        apiService.post("User/Edit", postData).then(function (response) {
            
            var loginSession = response.data;

            alert("edit User done");



        },
        function (error) {

        });



    }

};


