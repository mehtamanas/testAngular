angular.module('organization')

.controller('OrganizationController',
      function ($scope, $state, security, $cookieStore, apiService, $window, $rootScope) {
          console.log('OrganizationController');
          var orgID = $cookieStore.get('orgID');
          $rootScope.title = 'Dwellar./Organization';

       //  alert(orgID);
    //      orgID=   "820a5ec4-5901-4488-a727-74716d13fe83";
          if (orgID !== '') {

            alert(orgID);
              GetUrl = "Organization/Get/" + orgID;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;

              apiService.get(GetUrl).then(function (response) {

                  $scope.data = response.data;
                  
               //   $scope.name = $scope.data[0].name;
                //  $scope.organization_id = $scope.data[0].organization_id;
                  $scope.name = $scope.data[0].name;
                  $scope.address = $scope.data[0].address;
                  $scope.email = $scope.data[0].email;
                  $scope.divisions = $scope.data[0].divisions;
                  $scope.phone_no = $scope.data[0].phone_no;
                  $scope.list_in_builder_directory = $scope.data[0].list_in_builder_directory;
                  $scope.pan_no = $scope.data[0].pan_no;
                  $scope.tan_no = $scope.data[0].tan_no;
                  $scope.service_tax_no = $scope.data[0].service_tax_no;
                  $scope.cin_no = $scope.data[0].cin_no;
                  $scope.first_month_of_financial_year= $scope.data[0].first_month_of_financial_year;
                  $scope.language = $scope.data[0].language;
                  $scope.timezone = $scope.data[0].timezone;
                  if ($scope.data[0].contact_mobile !== '') {
                  $scope.mobile = $scope.data[0].contact_mobile;
                  }
                 
              },
                          function (error) {
                      
                              alert("not working");
                          });
          }
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

          $scope.editorg = function () {

              $state.go('EditOrganization');
          };
      }

);

