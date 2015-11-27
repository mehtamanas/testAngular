/**
 * Created by dwellarkaruna on 24/10/15.
 */
var ContactPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService) {
    console.log('ContactPopUpController');

    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
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
            class_type: "Contact",
            media_name: uploadResult.Name,
            media_url: uploadResult.Location,
            first_name: $scope.params.first_name,
            last_name: $scope.params.last_name,
            contact_element_info_email: $scope.params.contact_element_info_email,
            contact_element_info_phone: $scope.params.contact_element_info_phone,
            state: $scope.params.state,
            project_id: $scope.params.project_id,
            city: $scope.params.city,
            zip_code: $scope.params.zip_code,
        };

        //alert(postData.city);
        //alert(postData.media_url);
        apiService.post("Contact/CreateNew", postData).then(function (response) {
            var loginSession = response.data;
            alert("Contact done");
            $modalInstance.dismiss();

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





  

    $scope.params = {
        first_name: $scope.first_name,
        last_name: $scope.last_name,
        contact_element_info_email: $scope.contact_element_info_email,
        contact_element_info_phone: $scope.contact_element_info_phone,
        state: $scope.state,
        project_id: $scope.project_id,
        city: $scope.city,
        zip_code: $scope.zip_code,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId'),
       

    };
    
   

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }



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
           $scope.params.user_id = $scope.user1;
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
   
      
      
      