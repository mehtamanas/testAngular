/**
 * Created by dwellarkaruna on 24/10/15.
 */
var ContactPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $modal, $rootScope) {
    console.log('ContactPopUpController');

   
    

    var uploader = $scope.uploader = new FileUploader({
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

   
        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "AddNewContact",
                application: "angular",
                browser: $cookieStore.get('browser'),
                ip_address: $cookieStore.get('IP_Address'),
                location: $cookieStore.get('Location'),
                organization_id: $cookieStore.get('orgID'),
                User_ID: $cookieStore.get('userId'),
                
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
            first_name: $scope.params.first_name,
            age: $scope.params.age,
            gender: $scope.directory2,
            last_name: $scope.params.last_name,
            people_type: $scope.directory1,
            designation: $scope.params.designation,
            contact_element_info_email: $scope.choices1[0].contact_element_info_email,
            contact_element_info_phone: $scope.choices[0].contact_element_info_phone,
            state: $scope.params.state,
            project_id: $scope.params.project_id,
            city: $scope.params.city,
            zip_code: $scope.params.zip_code,
            class_type: "Contact",
            street_1: $scope.choices2[0].street_1,
          //  street_2: $scope.choices2[1].street_1,
            mappinguser_id: $scope.params.mappinguser_id


           
        };

        apiService.post("Contact/CreateNew", postData).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'contactGrid');


            var media = [];
            for (var i in $scope.choices1)
            {
                var postData_email =
                    {
                        id: $scope.choices1[i].class_id,
                        class_id: loginSession.id,
                        class_type: "Contact",
                        element_type: "email_contact",
                        element_info1: $scope.choices1[i].contact_element_info_email,
                    }
                media.push(postData_email);
            }
        
            for (var i in $scope.choices)
            {
                var postData_phone =
                    {
                        id: $scope.choices[i].class_id,
                        class_id: loginSession.id,
                        class_type: "Contact",
                        element_type: "phone_contact",
                        element_info1: $scope.choices[i].contact_element_info_phone,
                    }
                media.push(postData_phone);
            }

            for (var i in $scope.choices2) {
                var postData_address =
                    {
                        id: $scope.choices2[i].class_id,
                        class_id: loginSession.id,
                        class_type: "Contact",
                        element_type: "address_contact",
                        element_info1: $scope.choices2[i].street_1,
                    }
                media.push(postData_address);
            }
      


            apiService.post("ElementInfo/Create", media).then(function (response) {
                var loginSession = response.data;
            

            },
           function (error) {

           });
       
       

        },
       function (error) {

       });

    };




       

  
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        alert('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };




    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md'
        });

        
    }
  

    $scope.params = {
        first_name: $scope.first_name,
        last_name: $scope.last_name,
        contact_element_info_email: $scope.contact_element_info_email,
        contact_element_info_phone: $scope.contact_element_info_phone,
        state: $scope.state,
        project_id: $scope.project_id,
        city: $scope.city,
        age: $scope.age,
        gender:$scope.gender,
        zip_code: $scope.zip_code,
        people_type: $scope.people_type,
        designation: $scope.designation,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId'),
        street_1: $scope.street_1,
        street_2: $scope.street_2,
        mappinguser_id: $scope.mappinguser_id
        

    };
    
   

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.choices = [{ id: 'choice1' }];

    $(document).on("click", ".remove-field", function () {
        $(this).parent().remove();
    });

    $scope.choices = [{ id: 'choice1' }]; // remove code
    $scope.addNewChoice = function (e) {
        var classname = e.currentTarget.className;
        if (classname == 'remove-field') {

        }
        else if ($scope.choices.length) {
            var newItemNo = $scope.choices.length + 1;
            $scope.choices.push({ 'id': 'choice' + newItemNo });
        }

    };


    $scope.selectgender = function () {
        $scope.params.radioValue = $scope.directory1;
        //alert($scope.params.month);
    };


    $scope.selecttype = function () {
        $scope.params.radioValue = $scope.directory2;
        //alert($scope.params.month);
    };


    $scope.choices1 = [{ id: 'choice1' }]; // remove code
    $scope.addNewChoice1 = function (e) {
        var classname = e.currentTarget.className;
        if (classname == 'remove-field') {

        }
        else if ($scope.choices1.length) {
            var newItemNo = $scope.choices1.length + 1;
            $scope.choices1.push({ 'id': 'choice' + newItemNo });
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
        else if ($scope.choices2.length < 2) {
            var newItemNo2 = $scope.choices2.length + 1;
            $scope.choices2.push({ 'id': 'choice' + newItemNo2 });
        }

    };




    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
        //alert($scope.params.project_id);
    };



    Url = "user/Get/" + $cookieStore.get('orgID');
       apiService.get(Url).then(function (response) {
           $scope.users = response.data;
       },
      function (error) {
          alert("Error " + error.state);
      });
  
       $scope.selectuser = function () {
           $scope.params.mappinguser_id = $scope.user1;
           //alert($scope.params.user_id);
       };

          Url = "GetCSC/state" ;
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

          $scope.addNewContact = function (isValid) {
              $scope.showValid = true;
        
              if (isValid) {

                  contactList.first_name = $scope.params.first_name;
                  contactList.last_name = $scope.params.last_name;
                  contactList.User_ID = $scope.params.User_ID;
                  contactList.organization_id = $scope.params.organization_id;
                  contactList.people_type = 'Lead';
                  contactList.who_am_i = $scope.who_am_i;
                  //                
                  contactList.Android_SmartPhone_Version = $scope.Android_SmartPhone_Version;
                  contactList.Android_Tablet_Version = $scope.Android_Tablet_Version;
                  contactList.iPad_Version = $scope.iPad_Version;
                  contactList.iPhone_Version = $scope.iPhone_Version;
                  contactList.Kiosk_Version = $scope.Kiosk_Version;
                  contactList.allPhone = $scope.params.all_phone;

                  contactList.contact_mobile = $scope.params.mobile;
                  contactList.contact_email = $scope.params.email;
                  contactList.who_am_i = $scope.who_am_i;


                  if (contactList.who_am_i == 'others') {
                      contactList.others = $scope.others;
                  }

                  new ContactCreate(contactList).then(function (response) {
                      console.log(response);
                      $scope.showValid = false;
                      $scope.params.first_name = "";
                      $scope.params.last_name = "";
                      $scope.params.email = "";
                      $scope.params.mobile = "";

                  }, function (error) {
                      console.log(error);
                  });

              }
              if (isValid) {
                  $scope.showValid = false;
                  console.log(isValid);
                  if (isValid) {
                      $scope.showValid = false;
                  } else {
                      $scope.showValid = true;
                  }
              }

           
          }

      
      };
   
      
      
      