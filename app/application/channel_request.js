angular.module('application')

 //.config(function config($stateProvider) {
 //    $stateProvider
 //        .state('channelform', {
 //            url: '/channel form',
 //            templateUrl: 'channelform/channelform.tpl.html',
 //            controller: 'Channel_FormController',
 //             data: { pageTitle: 'Channel Partners Form' }
 //        });
 //})
.controller('channel_requestController',
      function ($scope, $state, $cookieStore, apiService,$modal, $filter) {
         
        
          




          if ($cookieStore.get('organization_id') !== '') {
            //  alert(window.sessionStorage.selectedCustomerID);
              GetUrl = "ChannelPartners/GetChannnelPartnerByID?id=" + window.sessionStorage.selectedCustomerID;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;

              apiService.get(GetUrl).then(function (response) {
                  $scope.data = response.data;
                  // alert($scope.data[0].name);
                  $scope.first_name = $scope.data[0].first_name;
                  $scope.last_name = $scope.data[0].last_name;
                  $scope.enrollment_no = $scope.data[0].enrollment_no;
                  $scope.project_site = $scope.data[0].project_site;
                  $scope.type_of_operation = $scope.data[0].type_of_operation;
                  $scope.pan_no = $scope.data[0].pan_no;
                  $scope.servicetaxno = $scope.data[0].servicetaxno;
                  $scope.chequeissuedname = $scope.data[0].chequeissuedname;
                  $scope.real_estate_association = $scope.data[0].real_estate_association;
                  $scope.name_of_association = $scope.data[0].name_of_association;
                  $scope.area_of_specialization = $scope.data[0].area_of_specialization;
                  $scope.total_turnover = $scope.data[0].total_turnover;
                  $scope.address = $scope.data[0].address;
                  $scope.state = $scope.data[0].state;
                  $scope.email = $scope.data[0].email;
                  $scope.website_url = $scope.data[0].website_url;
                  $scope.office_phone = $scope.data[0].office_phone;
                  $scope.mobile = $scope.data[0].mobile;
                  $scope.city = $scope.data[0].city;
                  $scope.pin = $scope.data[0].pin;
                  $scope.primary_occupations = $scope.data[0].primary_occupations;
                 
                 

                 
                 
              },

                          function (error) {
                              deferred.reject(error);
                              alert("not working");
                          });
          }
     
              //apiService.post("ChannelPartners/GetChannnelPartnerByID", postData).then(function (response) {
              //    var loginSession = response.data;
              //    alert("Channel Partner Done!!!");

              //},
              //function (error) {

              //});
                             
         
        
          //$scope.reset = function () {
          //    $scope.params = {};
          //}



          $scope.openAcceptPopup = function () {
              var modalInstance = $modal.open({
                  animation: true,
                  templateUrl: 'application/accept.tpl.html',
                  backdrop: 'static',
                  controller: acceptController,
                  size: 'md'
              });
          };

          $scope.openDeclinePopup = function () {
              var modalInstance = $modal.open({
                  animation: true,
                  templateUrl: 'application/decline.tpl.html',
                  backdrop: 'static',
                  controller: declineController,
                  size: 'md'
              });
          };



          $scope.addNew = function (isValid) {
              $scope.showValid = true;
              if (isValid) {
                 
               $scope.showValid = false;
              }

          }

      });

