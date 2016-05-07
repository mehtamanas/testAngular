angular.module('project')

.controller ('sendDemandLetterCtrl', function ($scope, $state, $rootScope, $modal, apiService, $cookieStore) 
{
    console.log('sendDemandLetterCtrl');

    //$scope.title = items.title;
 
    $scope.totalContact = $cookieStore.get('checkedIds');
    $scope.length = parseInt($scope.totalContact.length);
    $scope.PaymentId= $cookieStore.get('payment_schedule_id');
   var demandLetterTemplate = JSON.parse(window.localStorage.getItem("emailAddTemplate"));
   window.localStorage.removeItem('emailAddTemplate');
   $scope.template_name = $cookieStore.get('TemplateName');
   $scope.project_id = $cookieStore.get('projectId');
  

   $scope.sendDemandLetter = function ()
   {
       var letterDetails = [];
       
       for (var i in $scope.totalContact) {

           letterDetails.push({ 'client_id': $scope.totalContact[i], 'template_id': demandLetterTemplate.template_id, 'template': demandLetterTemplate.template, 'subject': demandLetterTemplate.subject, 'project_id': $scope.project_id, 'user_id': $cookieStore.get('userId'), 'organization_id': $cookieStore.get('orgID'), 'payment_detail_scheme_id': $scope.PaymentId, })

           //var postData = {
           //    client_id: $scope.totalContact,
           //    template_id: demandLetterTemplate.template_id,
           //    template: demandLetterTemplate.template,
           //    payment_dtail_scheme_id: $scope.PaymentId,
           //    subject: deemandLetterTemplate.subject,
           //    project_id: $scope.project_id,
           //    user_id: $cookieStore.get('userId'),
           //    organization_id: $cookieStore.get('orgID')
           //}
           apiService.post('Template/ClientDemandLetterMapping', letterDetails).then(function (response) {
               var SessionData = response.data;
               $scope.openSucessfullPopup();
           },

       function (error) {
       });


       }
    }

   $scope.addNew = function (isValid) {
       $scope.showValid = true;
       if (isValid) {
           $scope.sendDemandLetter();
           $scope.showValid = false;

       }

   }

   $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/demand_letter/successfull/sendSuccessful.html',
                backdrop: 'static',
                controller: sendSuccessfulCtrl,
                size: 'lg',
                resolve: { items: { title: "Demand Letter" } }

            });
            $rootScope.$broadcast('REFRESH1', 'EmailTemplateGrid');
        }

    

});