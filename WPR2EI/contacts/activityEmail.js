angular.module('contacts')
 .controller('activityEmailCtrl', function ($scope, $state, $cookieStore, apiService, $window, $modal, $rootScope, $stateParams) {
     console.log('activityEmailCtrl');

    

     var orgID = $cookieStore.get('orgID');

     $scope.seletedCustomerId = $stateParams.id;
    
     contactUrl = "SendEmail/GetEmailTransaction/" + $scope.seletedCustomerId;
     apiService.getWithoutCaching(contactUrl).then(function (response) {

         $scope.params = response.data[0];

         $scope.params.fromemailid = response.data[0].fromemailid;
         $scope.params.toemailid = response.data[0].toemailid;
         $scope.params.cc = response.data[0].cc;
         $scope.params.bcc = response.data[0].bcc;
         $scope.params.subject = response.data[0].subject;
         $scope.params.template = response.data[0].template;

     },
     function (error) {

     }
   );
 });