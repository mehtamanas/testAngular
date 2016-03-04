angular.module('channel_partners')

.controller('Channel_PartnersController',
      function ($scope, $state, security, apiService, $cookieStore, $rootScope) {

          $rootScope.title = 'Dwellars./ChannelPartners';

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

            //  alert("NAME1" + name);
              var params = {
                  name: name
              };
              apiService.post('Organization/Create', params).then(function (response) {

                  var loginSession = response.data;
                  //alert('Login Session : ' + loginSession.user_id);

                //  alert("hi");


              },

              function (error) {
                  // deferred.reject(error);
                  //return deferred.promise;
              });
             // alert("NAME1" + name);
              return deferred.promise;
          };
          // Login
          $scope.organization = function (isValid) {
              $scope.isSubmitted = true;
              $scope.showValid = true;

              if (isValid) {
                //  alert($scope.params.name);
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


          //Audit log start															
          $scope.params =
              {
                  device_os: $cookieStore.get('Device_os'),
                  device_type: $cookieStore.get('Device'),
                  device_mac_id: "34:#$::43:434:34:45",
                  module_id: "Contact",
                  action_id: "ChannelPartner",
                  details: "ChannelPartnerView",
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




          var orgID = $cookieStore.get('orgID');
          //alert(orgID);
          // Kendo code
          $scope.mainGridOptions = {
              dataSource: {
                  type: "json",
                  transport: {
                      read: apiService.baseUrl +"ChannelPartners/GetByID/" + orgID

                      //read:apiService.baseUrl +"ChannelPartners/GetByID/38a801a8-9c32-4b52-8433-00c059421218"
                  },
                  pageSize: 5

                  //group: {
                  //    field: 'sport'
                  //}
              },


              groupable: true,
              sortable: true,
              selectable: "multiple",
              reorderable: true,
              resizable: true,
              filterable: true,
            
              pageable: {
                  refresh: true,
                  pageSizes: true,
                  buttonCount: 5
              },

              columns: [
                  {
                    //  template: "<img height='40px' width='40px'  class='user-photo' src='assets/images/image-2.jpg' />" +
                      //"<span style='padding-left:10px' class='customer-name'>#: first_name #</span>",

                      field: "partner_name",
                      title: "Partner Name",
                      width: "120px",
                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
                    
                  }, {
                      field: "company",
                      title: "Comany",
                      width: "120px",
                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
                      
                  }, {
                      field: "contact_Email",
                      title: "Contact Email",
                      width: "120px",
                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
                    
                  }, {
                      field: "city",
                      title: "City",
                      width: "120px",
                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
                    
                  }, {
                      field: "total_projects",
                      title: "Total Projects",
                      width: "120px",
                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
                     
                  }, {
                      field: "property_sold",
                      title: "Property Sold",
                      width: "120px",
                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
                     
                  }, {
                      field: "property_listing",
                      title: "Property Listing",
                      width: "120px",
                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
                     
                  }, {
                      field: "revenue_generated",
                      title: "Revenue Generated",
                      width: "120px",
                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
                     
                  }, {
                      field: "commission_rate",
                      title: "Commission Rate",
                      width: "120px",
                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
                     
                  }]
          };
      }



);

