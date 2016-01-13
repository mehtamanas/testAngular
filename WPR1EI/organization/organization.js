angular.module('organization')

.controller('OrganizationController',
      function ($scope, $state, security, $cookieStore, $modal,apiService, $window, $rootScope) {
          console.log('OrganizationController');
          var orgID = $cookieStore.get('orgID');
          $rootScope.title = 'Dwellar./Organization';

       //  alert(orgID);
    //      orgID=   "820a5ec4-5901-4488-a727-74716d13fe83";
          if (orgID !== '') {

           
              GetUrl = "Organization/Get/" + orgID;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;

              apiService.get(GetUrl).then(function (response) {

                  $scope.data = response.data[0];

                  $scope.organization_id = $scope.data.organization_id;
                  $scope.name = $scope.data.name;
                  $scope.street_1 = $scope.data.street_1;
                  $scope.street_2 = $scope.data.street_2;
                  $scope.city = $scope.data.city;
                  $scope.state = $scope.data.state;
                  $scope.zip_code = $scope.data.zip_code;
                  $scope.country = $scope.data.country;
                  $scope.email = $scope.data.email;
                  $scope.divisions = $scope.data.divisions;
                  $scope.description = $scope.data.description;
                  $scope.phone_no = $scope.data.phone_no;
                  $scope.list_in_builder_directory = $scope.data.list_in_builder_directory;
                  $scope.pan_no = $scope.data.pan_no;
                  $scope.tan_no = $scope.data.tan_no;
                  $scope.service_tax_no = $scope.data.service_tax_no;
                  $scope.cin_no = $scope.data.cin_no;
                  $scope.first_month_of_financial_year= $scope.data.first_month_of_financial_year;
                  $scope.language = $scope.data.language;
                  $scope.timezone = $scope.data.timezone;
                  if ($scope.data.contact_mobile !== '') {
                  $scope.mobile = $scope.data.contact_mobile;
                  }
                 
              },
                          function (error) {
                      
                              alert("not working");
                          });
          }


          Url = "Project/GetProjectCount/" + orgID;

          apiService.get(Url).then(function (response) {

              $scope.data1 = response.data;
              $scope.project_count = $scope.data1[0].project_count;
              $scope.user_count = $scope.data1[0].user_count;
              

          },
      function (error) {
          alert("Error " + error.state);
      });


          //if (orgID !== '') {

          //    GetUrl = "Project/GetProjectCount/" + orgID;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;

          //    apiService.get(GetUrl).then(function (response) {

          //        $scope.data1 = response.data1;

          //        $scope.project_count = $scope.data1[0].project_count;
          //        $scope.user_count = $scope.data1.user_count;

          //    },
          //                function (error) {

          //                    alert("not working");
          //                });
          //}
             
          // Init model
          $scope.params = {
              name: ''
                };

          $scope.error = '';
          $scope.success = '';

          $scope.$watch('params', function () {
              $scope.error = '';
              $scope.success = '';
          });

          organizationcreate = function (name) {

              alert("NAME1" + name);
              var params = {
                  name: name
              };
              apiService.post('Organization/Create', params).then(function (response) {

                  var loginSession = response.data;
                  //alert('Login Session : ' + loginSession.user_id);

                  //alert("hi");


              },

              function (error) {
                  // deferred.reject(error);
                  //return deferred.promise;
              });
              alert("NAME1" + name);
              return deferred.promise;
          };

          //Audit log start
          $scope.params = {

              device_os: "windows10",
              device_type: "mobile",
              device_mac_id: "34:#$::43:434:34:45",
              module_id: "Organization",
              action_id: "Organization View",
              details: "Organization detail",
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
          
          // Login
          $scope.organization = function (isValid) {
              $scope.isSubmitted = true;
              $scope.showValid = true;

              if (isValid) {
                  alert($scope.params.name);
                  organizationcreate($scope.params.name).then(function (response) {
                      console.log(response);
                      $scope.success = 'Login successful!';
                      $scope.error = '';

                      if (!security.redirect()) {
                          $state.go('loggedIn.modules.user_management.signup_user_list');
                      }
                  }, function (error) {
                      console.log(error);
                      $scope.success = '';
                      $scope.error = 'Invalid Email Address or Passowrd. Please try again.';
                  });
              }
          };

          $scope.$on('REFRESH', function (event, args) {

              setTimeout(function () {
                  if (args == 'organization') {
                      projectUrl = "Organization/Get/" + orgID;//8c4128e2-785b-4ad6-85af-58344dd79517";
                      apiService.getWithoutCaching(projectUrl).then(function (response) {
                          $scope.data = response.data[0];
                          $scope.organization_id = $scope.data.organization_id;
                          $scope.name = $scope.data.name;
                          $scope.street_1 = $scope.data.street_1;
                          $scope.street_2 = $scope.data.street_2;
                          $scope.city = $scope.data.city;
                          $scope.state = $scope.data.state;
                          $scope.zip_code = $scope.data.zip_code;
                          $scope.country = $scope.data.country
                          $scope.email = $scope.data.email;
                          $scope.divisions = $scope.data.divisions;
                          $scope.description = $scope.data.description;
                          $scope.phone_no = $scope.data.phone_no;
                          $scope.list_in_builder_directory = $scope.data.list_in_builder_directory;
                          $scope.pan_no = $scope.data.pan_no;
                          $scope.tan_no = $scope.data.tan_no;
                          $scope.service_tax_no = $scope.data.service_tax_no;
                          $scope.cin_no = $scope.data.cin_no;
                          $scope.first_month_of_financial_year = $scope.data.first_month_of_financial_year;
                          $scope.language = $scope.data.language;
                          $scope.timezone = $scope.data.timezone;
                          if ($scope.data.contact_mobile !== '') {
                              $scope.mobile = $scope.data.contact_mobile;
                          }
                          $state.go('app.organization', {}, { reload: false });

                      },
                          function (error) {
                              console.log("Error " + error.state);
                          }
                      );
                  }
              },1500);

          });

              $scope.openEditOrgPopup = function () {
                  var modalInstance = $modal.open({
                      animation: true,
                      templateUrl: 'organization/EditOrganization.tpl.html',
                      backdrop: 'static',

                      controller: EditOrgPopUpController,
                      size: 'md'
                  });
              };
         
          }
          
);

