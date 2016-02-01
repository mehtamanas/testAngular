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
            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader.queue.length > 1) {
            uploader.removeFromQueue(0);
        }
    }
   
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


    // CALLBACKS
        uploader.onSuccessItem = function (fileItem, response, status, headers)
        {
            // post image upload call the below api to update the database

            $scope.media_url = response[0].Location;
            uploader_done = true;
            if (uploader_done == true) {
                $scope.showProgress = false;
                $scope.finalpost();
            }

        };
    

        var called = false;

        $scope.finalpost = function ()
        {
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
             

            }


            var postData = {
                user_id: $cookieStore.get('userId'),
                organization_id: $cookieStore.get('orgID'),
                //media_name: uploadResult.Name,
                media_url: $scope.media_url,
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
                Street_1: newadd.Street_1,
                Street_2: newadd.Street_2,
                mappinguser_id: $scope.params.mappinguser_id



            };

            apiService.post("Contact/CreateNew", postData).then(function (response) {
                var loginSession = response.data;
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
                $rootScope.$broadcast('REFRESH', 'contactGrid');


                var media = [];
                for (var i in $scope.choices1) {
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

                for (var i in $scope.choices) {
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

               



                apiService.post("ElementInfo/Create", media).then(function (response) {
                    var loginSession = response.data;
                    called = true;

                },
               function (error)
               {
                   if (error.status === 400)
                       alert(error.data.Message);
                   else
                       alert("Network issue");

               });



            },
           function (error)
           {
               if (error.status === 400)
                   alert(error.data.Message);
               else
                   alert("Network issue");

           });

            var address = [];

            for (var i in $scope.choices2) {

                var newadd = {};
                newadd.Street_1 = $scope.choices2[i].Street_1;

                newadd.Street_2 = $scope.choices2[i].Street_2;
                address.push(newadd);


            }



        }

  
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
            size: 'md',
            resolve: { items: { title: "Contact" } }
        });

        
    }
  


    var address = [];
        
    for (var i in $scope.choices2) {     

        var newadd = {};     
        newadd.Street_1 = $scope.choices2[i].Street_1;
         
        newadd.Street_2 = $scope.choices2[i].Street_2;
        address.push(newadd);
           
            
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

          $scope.addNewContact = function (isValid)
          {
              $scope.showValid = true;
        
              if (isValid)
              {
                  if (uploader.queue.length != 0)
                      uploader.uploadAll();
                  if (uploader.queue.length == 0)
                      $scope.finalpost();

                  $scope.showValid = false;
              }   
          }

      
      };
   
      
      