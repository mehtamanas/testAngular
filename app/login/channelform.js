
var ChannelPopupContoller = function ($scope, $state, $cookieStore, $rootScope, apiService, $modalInstance, FileUploader, uploadService, $modal) {
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
                  company: $scope.params.company,
                  enrollment_no: $scope.params.enrollment_no,
                  project_site: $scope.params.project_site,
                  type_of_operation: $scope.radioValue2,
                  pan_no: $scope.params.pan_no,
                  servicetaxno: $scope.params.servicetaxno,
                  chequeissuedname: $scope.params.chequeissuedname,
                  real_estate_association: $scope.params.real_estate_association,
                  name_of_association: $scope.params.name_of_association,
                  area_of_specialization: $scope.areatype,
                  primary_occupations: $scope.params.primary_occupations,
                  yes_no_primary_occupation: $scope.yesnoprimary,
                  individual_organization: $scope.radioValue7,
                  total_turnover: $scope.turnover,
                  address: $scope.params.address,
                  state: $scope.params.state,
                  email: $scope.params.email,
                  real_estate: $scope.realyesno,
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
                  //alert("channel Partner Apllied");
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
          };
       


          $scope.params = {
              first_name: $scope.first_name,
              last_name: $scope.last_name,
              enrollment_no: $scope.enrollment_no,
              project_site: $scope.project_site,
              type_of_operation: $scope.type_of_operation,
              pan_no: $scope.pan_no,
              servicetaxno: $scope.servicetaxno,
              company: $scope.company,
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
              yes_no_primary_occupation: $scope.yes_no_primary_occupation,
              mobile: $scope.mobile,
              city: $scope.city,
              pin: $scope.pin,
              individual_organization: $scope.individual_organization,
              real_estate: $scope.real_estate,
              yes_no_primary_occupation: $scope.yes_no_primary_occupation,
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
              company: $scope.company,
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
              yes_no_primary_occupation: $scope.yes_no_primary_occupation,
              mobile: $scope.mobile,
              city: $scope.city,
              pin: $scope.pin,
              individual_organization: $scope.individual_organization,
              real_estate: $scope.real_estate,
              yes_no_primary_occupation: $scope.yes_no_primary_occupation,
              organization_id: $cookieStore.get('orgID'),
              User_ID: $cookieStore.get('userId')
          };

          
          Url = "GetCSC/state";

          apiService.get(Url).then(function (response) {
              $scope.state = response.data;

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
              $scope.city = response.data;

          },
      function (error) {
          alert("Error " + error.state);
      });

          $scope.selectcity = function () {
              $scope.params.city = $scope.city1;
              //alert($scope.params.city);
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

                  //if ($scope.realyesno == "Yes") {

                  //    $scope.params.real_estate_association = $scope.realyesno;
                  //}
                  //else ($scope.realyesno == "No")
                  //{
                  //    $scope.params.real_estate_association = $scope.realyesno;
                  //};                



                  if ($scope.radioValue7 == 1) {
                      $scope.individual_organization = "Individual";

                  }
                  else {
                      $scope.individual_organization = "Organization";
                  }




                  if ($scope.yesnoprimary == 1) {
                      $scope.yes_no_primary_occupation = "Yes";

                  }
                  else {
                      $scope.yes_no_primary_occupation = "No";
                  }
                  
                  


                  if ($scope.radioValue2 == 1) {

                      $scope.type_of_operation = "Individual";
                  }
                  else if ($scope.radioValue2 == 1) {
                      $scope.type_of_operation = "Propritorship";
                  }
                  else if ($scope.radioValue2 == 1) {
                      $scope.type_of_operation = "Propritorship Firm";
                  }
                  else {
                      $scope.type_of_operation = "Limited Company";
                  }

                  ////end of individual////
                  if ($scope.realyesno ==1)
                  {

                      $scope.real_estate_association = "Yes";
                  }
                  else ($scope.realyesno == 1)
                  {
                      $scope.real_estate_association ="No";
                  };


                  
                  if ($scope.areatype == 1) {

                      $scope.params.area_of_specialization = "Real Estate";
                  }
                  else if ($scope.areatype == 1) {
                      $scope.params.area_of_specialization = "Residential";
                  }
                  else if ($scope.areatype == 1) {
                      $scope.params.area_of_specialization = "Industry";
                  }
                  else if ($scope.areatype == 1) {
                      $scope.params.area_of_specialization = "Retail";
                  }
                  else ($scope.areatype == 1)
                  {
                      $scope.params.area_of_specialization = "Land";
                  }
                  


                  if ($scope.turnover == 1) {

                      $scope.params.total_turnover = "0-3cr";
                  }
                  else if ($scope.turnover == 1) {
                      $scope.params.total_turnover = "3-10cr";
                  }
                  else if ($scope.turnover == 1) {
                      $scope.params.total_turnover = "10-25cr";
                  }
                  else if ($scope.turnover == 1) {
                      $scope.params.total_turnover = "25-40cr";
                  }
                  else ($scope.turnover == 1)
                  {
                      $scope.params.total_turnover = "50cr and more";
                  }

                  $scope.showValid = false;

              }

          }



      };

