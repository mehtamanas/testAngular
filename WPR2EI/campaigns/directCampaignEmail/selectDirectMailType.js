angular.module('campaigns')

.controller('directMailTypeCtrl',
function ($scope, $state, $cookieStore, apiService, FileUploader, $window, uploadService, $modal, $rootScope, $sanitize, $sce) {
    var orgID = $cookieStore.get('orgID');

    $scope.fromEmail = $cookieStore.get('currentUser');
    $scope.fromEmail = $scope.fromEmail.account_email;
    $scope.loadingDemo = false;
    //Audit log start               
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           //device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
          // details: $scope.params.subject + "Email Template",
           application: "angular",
           browser: $cookieStore.get('browser'),
           ip_address: $cookieStore.get('IP_Address'),
           location: $cookieStore.get('Location'),
           organization_id: $cookieStore.get('orgID'),
           User_ID: $cookieStore.get('userId')
       };


        apiService.post("AuditLog/Create", postdata).then(function (response) {
            var loginSession = response.data;
        },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                //alert("Network issue");
                sweetAlert(
                          'Oops...',
                          'Network issue!',
                          'error'
                        )
        });
    };

    //end


  
   
    $scope.next = function () {
       
            var postData = {
                description: $scope.params.description,
                campaign_subtype: $scope.params.campaign_subtype,
                document_type_id: "6978399d-7ee7-42a6-85dd-6fec5b7312c2"
            }
            sweetAlert("", "Your Email Campaign Send From this Email-Id: " + $scope.fromEmail);
            window.localStorage.setItem("emailAddTemplate", JSON.stringify(postData));
            AuditCreate();
            $state.go('app.summaryMailType');  
    }

    //$scope.preview = function () {
    //    var modalInstance = $modal.open({
    //        animation: true,
    //        templateUrl: 'campaigns/emailCampaign/emailAddPreview.html',
    //        backdrop: 'static',
    //        controller: emailAddPreviewCtrl,
    //        size: 'lg',
    //        resolve: {
    //            items: function () {
    //                return $scope.params.bodyText;
    //            }
    //        }
    //    });
    //}

    $scope.cancel = function () {

        $state.go('app.campaigns');
    };
    $scope.back = function () {
        $cookieStore.remove('emailAddTemplate');
        $state.go('app.contactDirectMailCampaign');
    }

    $scope.sendEmail = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            $scope.loadingDemo = true;
            $scope.showValid = false;
        }
    }
})