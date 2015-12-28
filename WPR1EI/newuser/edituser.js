
var EditUserPopUpController = function ($scope, $state, $modalInstance, $cookieStore, apiService, $modal, $window, FileUploader, uploadService) {
    console.info("EditUserPopUpController");

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

  var uploader = $scope.uploader = new FileUploader({
      url: 'https://dw-webservices-dev2.azurewebsites.net/MediaElement/upload'
  });

     alert($scope.seletedCustomerId);

  if ($scope.seletedCustomerId !== '')
  {
         GetUrl = "User/GetUserDetails/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
         apiService.get(GetUrl).then(function (response)
         {
             $scope.data = response.data;

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
            if ($scope.data.contact_mobile !== '')
            {
                $scope.mobile = $scope.data.contact_mobile;
            }
            if ($scope.data.contact_email !== '')
            {
                $scope.email = $scope.data.contact_Email;
            }
        },
                    function (error)
                    {
                         alert("not working");
                    });
    }

  $scope.params =
      {
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


    //Audit log start															
  $scope.params =
      {
          device_os: $cookieStore.get('Device_os'),
          device_type: $cookieStore.get('Device'),
          device_mac_id: "34:#$::43:434:34:45",
          module_id: "Contact",
          action_id: "Contact View",
          details: "EditUser",
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
    //state and city functionality
        Url = "GetCSC/state";
        apiService.get(Url).then(function (response)
        {
            $scope.states = response.data;
        },
        function (error)
        {
          alert("Error " + error.state);
       });

        $scope.selectstate = function ()
        {
          $scope.params.state = $scope.state1;
       
        };

        Url = "GetCSC/city";
        apiService.get(Url).then(function (response)
        {
            $scope.cities = response.data;
        },
        function (error)
        {
            alert("Error " + error.cities);
         });

        $scope.selectcity = function ()
        {
            $scope.params.city = $scope.city1;
        };

       ///filtering of state city
        $scope.filterExpression = function (city)
        {
            return (city.stateid === $scope.params.state); 
        };


        Url = "Role/Get/";
        apiService.get(Url).then(function (response)
        {
           $scope.roles = response.data;
        },
        function (error)
        {
          alert("Error " + error.roles);
         });

        $scope.selectrole = function ()
        {
           $scope.params.role_name = $scope.role_name1;
        };

    //end state and city functionality
  
    //cancel and reset functionality
   
        $scope.reset = function ()
        {
          $scope.params = {};
        }

        $scope.cancel = function ()
        {
           $modalInstance.dismiss('cancel');
        };

    //end cancel and reset functionality
    $scope.addNew = function (isValid) {
       
        $scope.showValid = true;
        //   new OrgEdit($scope.params);
        if (isValid) {

            $scope.showValid = false;

        }
    };

    //uploader functionality
    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options)
        {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    uploader.onErrorItem = function (fileItem, response, status, headers)
    {
        alert('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers)
    {
        $scope.showProgress = false;
    };


    uploader.onSuccessItem = function (fileItem, response, status, headers)
    {
        // post image upload call the below api to update the database
        var uploadResult = response[0];

        // TODO: Need to get these values dynamically
        var postData =
            {
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
        
        apiService.post("User/Edit", postData).then(function (response)
        {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
        },
        function (error)
        {
            alert("not working ");
        });

        $scope.openSucessfullPopup = function ()
        {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'md'
            });
        }

    }

};


