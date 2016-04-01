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
        var postData = {
            client_id: $scope.totalContact,
            template_id: demandLetterTemplate.template,
            template: demandLetterTemplate.bodyText,
            payment_detail_scheme_id: $scope.PaymentId,
            subject: demandLetterTemplate.subject,
            project_id: $scope.project_ids,
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID')
        }
        apiService.post('Template/ClientDemandLetterMapping', postData).then(function (response) {
            var SessionData = response.data;

            
        },
       function (error) {

       });

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
                templateUrl: 'newuser/delete.html',
                backdrop: 'static',
                controller: DeleteController,
                size: 'md',
                resolve: { items: { title: "Email Template" } }

            });
            $rootScope.$broadcast('REFRESH1', 'EmailTemplateGrid');
        }

    

});