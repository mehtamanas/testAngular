var AddNewPaymentSchemeController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $rootScope, $modal) {
    console.log('AddNewPaymentSchemeController');


    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');

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

    //Audit log start
    $scope.params = {

        device_os: "windows10",
        device_type: "mobile",
        device_mac_id: "34:#$::43:434:34:45",
        module_id: "Wing",
        action_id: "Wing View",
        details: "ProjectDetail",
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
   


    $scope.choices = [{ id: 'choice1' }];

    $scope.addNewChoice = function () {
        var newItemNo = $scope.choices.length + 1;
        $scope.choices.push({ 'id': 'choice' + newItemNo });
    };

   
    paymentCreate = function (param) {

        apiService.post("Payment/Add_new_Payment_scheme", param).then(function (response) {
            var loginSession = response.data;
            var schemeupdate = [];
            for (var i in $scope.choices) {
                var newscheme = {};
                
                newscheme.user_id = $cookieStore.get('userId');
                newscheme.organization_id = $cookieStore.get('orgID');
                newscheme.Milestone = $scope.choices[i].Milestone;
                newscheme.percentage = $scope.choices[i].percentage;
                newscheme.project_id = window.sessionStorage.selectedCustomerID;
                newscheme.payment_schedule_id = loginSession.id;
                schemeupdate.push(newscheme);
            }

            apiService.post("Payment/new_Paymnt_scheme_Milestn", schemeupdate).then(function (response) {
                $scope.choices = response.data;
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
            },
         function (error) {

         });
            
            $modalInstance.dismiss();

        },
   function (error) {

   });
    }

   

        //var postData = {
        //    user_id: $cookieStore.get('userId'),
        //    organization_id: $cookieStore.get('orgID'),
        //    id: window.sessionStorage.selectedCustomerID,
        //    Pay_Scheme_name: $scope.params.Pay_Scheme_name,
        //    base_rate: $scope.params.base_rate,
          

        //};
       
            
        //apiService.post("Payment/Add_new_Payment_scheme", param).then(function (response) {
        //    var loginSession = response.data;
        //    alert("Floor Updated...");
        //    $modalInstance.dismiss();

        //},
        //    function (error) {

        //    });

        //end

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',

        });
        $rootScope.$broadcast('REFRESH', 'payment');
    };
    $scope.params = {
        Pay_Scheme_name: $scope.Pay_Scheme_name,
        base_rate: $scope.base_rate,
        project_id: window.sessionStorage.selectedCustomerID,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId')
    };

    var emp = {
       
        Pay_Scheme_name: $scope.Pay_Scheme_name,
        base_rate: $scope.base_rate,
        project_id: window.sessionStorage.selectedCustomerID,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId')
    };


    

   
   

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    ////$scope.reset = function () {
    ////    $scope.params = {};
    ////}

    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {


            new paymentCreate($scope.params).then(function (response) {
                console.log(response);
                $scope.showValid = false;
                $state.go('guest.signup.thanks');
            }, function (error) {
                console.log(error);
            });

            $scope.showValid = false;

        }

    }

};