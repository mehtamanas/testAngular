

 
var ChannelPopupContoller = function ($scope, $state, $cookieStore,$rootScope, apiService, $modalInstance, FileUploader, uploadService) {
    console.log('ChannelPopupContoller');
          $rootScope.title = 'Dwellar./ChannelDetails';
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
                  userid: $cookieStore.get('userId'),
                  organization_id: window.sessionStorage.selectedCustomerID,
                  media_name: uploadResult.Name,
                  media_url: uploadResult.Location,
                  class_type: "channel Partner Form",
                  media_type: "Logo",
                  first_name: $scope.params.first_name,
                  last_name: $scope.params.last_name,
                  enrollment_no: $scope.params.enrollment_no,
                  project_site: $scope.params.project_site,
                  type_of_operation: $scope.params.type_of_operation,
                  pan_no: $scope.params.pan_no,
                  servicetaxno: $scope.params.servicetaxno,
                  chequeissuedname: $scope.params.chequeissuedname,
                  real_estate_association: $scope.params.real_estate_association,
                  name_of_association: $scope.params.name_of_association,
                  area_of_specialization: $scope.params.area_of_specialization,
                  primary_occupations: $scope.params.primary_occupations,
                  total_turnover: $scope.params.total_turnover,
                  address: $scope.params.address,
                  state: $scope.params.state,
                  email: $scope.params.email,
                  website_url: $scope.params.website_url,
                  office_phone: $scope.params.office_phone,
                  mobile: $scope.params.mobile,
                  city: $scope.params.city,
                  pin: $scope.params.pin,
                  status: "Applied"
              };

              //alert(postData.city);
              //alert(postData.media_url);
              apiService.post("ChannelPartners/Create", postData).then(function (response) {
                  var loginSession = response.data;
                  $cookieStore.put('builderflow', "no");
                  alert("channel Partner Apllied");
                  $modalInstance.dismiss();

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

          uploader.onErrorItem = function (fileItem, response, status, headers) {
              alert('Unable to upload file.');
          };

          uploader.onCompleteItem = function (fileItem, response, status, headers) {
              $scope.showProgress = false;
          };

          //Audit log start
          // $scope.params = {

          //     device_os: "windows10",
          //     device_type: "mobile",
          //     device_mac_id: "34:#$::43:434:34:45",
          //     module_id: "Addnew Project",
          //     action_id: "Addnew Project View",
          //     details: "Addnew Project detail",
          //     application: "angular",
          //     browser: $cookieStore.get('browser'),
          //     ip_address: $cookieStore.get('IP_Address'),
          //     location: $cookieStore.get('Location'),
          //     organization_id: $cookieStore.get('orgID'),
          //     User_ID: $cookieStore.get('userId')
          // };


          // AuditCreate = function (param) {

          //     apiService.post("AuditLog/Create", param).then(function (response) {
          //         var loginSession = response.data;

          //     },
          //function (error) {

          //});
          // };
          // AuditCreate($scope.params);

          //end


          $scope.params = {
             
              organization_id: $cookieStore.get('orgID'),
              User_ID: $cookieStore.get('userId')
          };

          var emp = {
              
              first_name: $scope.first_name,
              last_name: $scope.last_name,
              enrollment_no: $scope.enrollment_no,
              project_site: $scope.project_site,
              type_of_operation: $scope.type_of_operation,
              pan_no: $scope.pan_no,
              servicetaxno: $scope.servicetaxno,
              chequeissuedname: $scope.chequeissuedname,
              real_estate_association: $scope.real_estate_association,
              name_of_association: $scope.name_of_association,
              area_of_specialization: $scope.area_of_specialization,
              primary_occupations: $scope.primary_occupations,
              total_turnover: $scope.total_turnover,
              address: $scope.address,
              state: $scope.state,
              email: $scope.email,
              website_url: $scope.website_url,
              office_phone: $scope.office_phone,
              mobile: $scope.mobile,
              city: $scope.city,
              pin: $scope.pin,
              organization_id: $cookieStore.get('orgID'),
              User_ID: $cookieStore.get('userId')
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


                  if ($scope.radioValue2 == "Individual") {

                      $scope.params.type_of_operation = $scope.radioValue2;
                  }
                  else if ($scope.radioValue2 == "Propritorship") {
                      $scope.params.type_of_operation = $scope.radioValue2;
                  }
                  else if ($scope.radioValue2 == "Propritorship Firm") {
                      $scope.params.type_of_operation = $scope.radioValue2;
                  }
                  else {
                      $scope.params.type_of_operation = $scope.radioValue2;
                  }

                  ////end of individual////
                  if ($scope.realyesno == "Yes")
                  {

                      $scope.params.real_estate_association = $scope.realyesno;
                  }
                  else ($scope.realyesno == "No")
                  {
                      $scope.params.real_estate_association = $scope.realyesno;
                  };
                  //////end of individual////
                  //if ($scope.yesno == "Yes") {

                  //    $scope.params.type_of_operation = $scope.yesno;
                  //}
                  //else ($scope.yesno == "No")
                  //{
                  //    $scope.params.type_of_operation = $scope.yesno;
                  //};
                  ////end of individual////   
                  if ($scope.areatype == "Real Estate") {

                      $scope.params.area_of_specialization = $scope.areatype;
                  }
                  else if ($scope.areatype == "Residential") {
                      $scope.params.area_of_specialization = $scope.areatype;
                  }
                  else if ($scope.areatype == "Industry") {
                      $scope.params.area_of_specialization = $scope.areatype;
                  }
                  else if ($scope.areatype == "Retail") {
                      $scope.params.area_of_specialization = $scope.areatype;
                  }
                  else ($scope.areatype == "Land")
                  {
                      $scope.params.area_of_specialization = $scope.areatype;
                  }
                  ///end of individual////
                  if ($scope.turnover == "Real Estate") {

                      $scope.params.total_turnover = $scope.turnover;
                  }
                  else if ($scope.turnover == "Residential") {
                      $scope.params.total_turnover = $scope.turnover;
                  }
                  else if ($scope.turnover == "Industry") {
                      $scope.params.total_turnover = $scope.turnover;
                  }
                  else if ($scope.turnover == "Retail") {
                      $scope.params.total_turnover = $scope.turnover;
                  }
                  else ($scope.turnover == "Land")
                  {
                      $scope.params.total_turnover = $scope.turnover;
                  }

                  $scope.showValid = false;

              }

          }



      };

