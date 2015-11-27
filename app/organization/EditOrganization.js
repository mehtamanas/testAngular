angular.module('organization')//to chnage

    .config(function config($stateProvider) {
        $stateProvider
            .state('EditOrganization', {
                url: '/EditOrganization',
                templateUrl: 'organization/EditOrganization.tpl.html',
                controller: 'EditOrgController',
                data: { pageTitle: 'Edit Org Page' }
            });
    })




.controller('EditOrgController',
      function ($scope, $state, $cookieStore, apiService,  FileUploader, uploadService) {

          var orgID = $cookieStore.get('orgID');
          var uploader = $scope.uploader = new FileUploader({
              url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
          });


          if (orgID !== '') {

              alert(orgID);
              GetUrl = "Organization/Get/" + orgID;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;

              apiService.get(GetUrl).then(function (response) {

                  $scope.data = response.data;

                     $scope.name = $scope.data[0].name;
                     $scope.organization_id = $scope.data[0].organization_id;
                     $scope.description = $scope.data[0].description;
                  $scope.name = $scope.data[0].name;
                  $scope.address = $scope.data[0].address;
                  $scope.email = $scope.data[0].email;
                  $scope.phone_no = $scope.data[0].phone_no;
                  $scope.pan_no = $scope.data[0].pan_no;
                  $scope.tan_no = $scope.data[0].tan_no;
                  $scope.service_tax_no = $scope.data[0].service_tax_no;
                  $scope.cin_no = $scope.data[0].cin_no;
                  $scope.fiscal_year = $scope.data[0].fiscal_year;
                  $scope.language = $scope.data[0].language;
                  $scope.timezone = $scope.data[0].timezone;
                  $scope.divisions = $scope.data[0].divisions;
                  if ($scope.data[0].contact_mobile !== '') {
                      $scope.mobile = $scope.data[0].contact_mobile;
                  }

              },
                          function (error) {

                              alert("not working");
                          });
          }

          $scope.showProgress = false;
          
          $scope.params = {
              name: $scope.name,
              address: $scope.address,             
              description: $scope.description,
              divisions: $scope.divisions,
              email:  $scope.email,
              phone_no: $scope.phone_no,
              language: $scope.language,
              list_in_builder_directory: $scope.list_in_builder_directory,
              pan_no: $scope.pan_no,
              tan_no: $scope.tan_no,
              service_tax_no: $scope.service_tax_no,
              first_month_of_financial_year: $scope.first_month_of_financial_year,
              cin_no: $scope.cin_no,
              organization_id: $cookieStore.get('orgID'),
              User_ID: $cookieStore.get('userId')
              

          };
          //  alert($scope.organization_id);

        

          Url = "GETCSC/GetTime";

          apiService.get(Url).then(function (response) {
              $scope.timezone = response.data;

          },
      function (error) {
          alert("Error " + error.state);
      });


          $scope.SelectTimezone = function () {
              $scope.params.timezone = $scope.timezone1;
              alert($scope.params.timezone);
          };

          Url = "GETCSC/GetMonth";

          apiService.get(Url).then(function (response) {
              $scope.month = response.data;

          },
      function (error) {
          alert("Error " + error.state);
      });

          $scope.selectmonth = function () {
              $scope.params.month = $scope.month1;
              //alert($scope.params.month);
          };




          $scope.reset = function () {
              $scope.params = {};
          }

          // projectUrl = "Organization/Edit";
          // ProjectCreate = function (param) {


          //}

          $scope.addNew = function (isValid) {
             // alert("Hi in add new function");
              $scope.showValid = true;
           //   new OrgEdit($scope.params);
              if (isValid) {

                  $scope.showValid = false;

              }
          };

          if ($scope.radioValue == 1) {
              $scope.list_in_builder_directory= "Yes";

          }
          else {
              $scope.list_in_builder_directory= "No";
          }
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
                  name: $scope.name,
                  address: $scope.address,
                  organization_id: $cookieStore.get('orgID'),
                  userid: $cookieStore.get('userId'),
                  description: $scope.description,
                  divisions: $scope.divisions,
                  email: $scope.email,
                  phone_no: $scope.phone_no,
                  language: $scope.language,
                  list_in_builder_directory: $scope.radioValue,
                  pan_no: $scope.pan_no,
                  tan_no: $scope.tan_no,
                  service_tax_no: $scope.service_tax_no,
                  cin_no: $scope.cin_no,
                 
                  first_month_of_financial_year: $scope.params.month,
                  timezone: $scope.params.timezone

              };
              alert($scope.params.divisions);
              
              apiService.post("Organization/Edit", postData).then(function (response) {
                  //alert("hi dude");
                  var loginSession = response.data;

                  alert("edit org done");
                  

              },
              function (error) {

              });
           
          

          }

      });

