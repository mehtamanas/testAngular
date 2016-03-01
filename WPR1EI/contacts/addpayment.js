
var PaymentUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope,$window) {
    console.log('PaymentUpController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    //Audit log start															
   
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
          // device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details: $scope.params.Amount + "AddNewPayment",
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
           alert("Network issue");
   });
    };
   

    //end
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    //end

    var called = false;

    $scope.finalpost = function ()
    {
        if (called == true) {
            return;
        }
        var postData = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            payment_schedule_id: $scope.params.payment_type1,
            Amount: $scope.params.Amount,
            duedate: $scope.params.duedate,
            contact_id: window.sessionStorage.selectedCustomerID,
        };

        apiService.post("Payment/CreateAddNewPayment", postData).then(function (response) {
            var loginSession = response.data;
            AuditCreate();
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();
            $rootScope.$broadcast('REFRESH', 'PaymentGrid');
            called = true;
        },
     function (error) {

     });

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'md',
                resolve: { items: { title: "Payment" } }
            });
        } 
    }
   
    $scope.params = {
        payment_schedule_id: $scope.payment_type1,
        Amount: $scope.Amount,
        duedate: $scope.duedate,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
    };

    var emp = {
        payment_schedule_id: $scope.payment_type1,
        Amount: $scope.Amount,
        duedate: $scope.duedate,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        contact_id: window.sessionStorage.selectedCustomerID,
    };

        Url = "Payment/GetPayment";
        apiService.get(Url).then(function (response) {
            $scope.payment = response.data;

        },
    function (error) {
        console.log("Error " + error.state);
    });

        $scope.selectpay = function () {
            $scope.params.payment_type1 = $scope.pay1;
           
        };

        $scope.addNewPayment = function (isValid)
        {
            $scope.showValid = true;
            if (isValid)
            {
                $scope.finalpost();
                $rootScope.$broadcast('REFRESH', 'PaymentGrid');

            $scope.showValid = false;

            }
        }
};