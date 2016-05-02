angular.module('app.guest.login')
    .config(function ($stateProvider) {
        $stateProvider
            .state('cheque_payment', {
                url: '/ChequePayment',
                templateUrl: 'login/cheque_payment.tpl.html',
                controller: 'PaymentController',
                title: 'cheque_payment'
            });

    })
  .controller('PaymentController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $http) {

        var orgID = $cookieStore.get('orgID');
        var userId = $cookieStore.get('userId');
        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "AddNewPayment",
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
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.reset = function () {
            $scope.params = {};
        }

        AuditCreate($scope.params);

        //end


        $scope.finalpost = function () {
            // TODO: Need to get these values dynamically
            var postData = {
                subscription_id: $scope.params.Subscription_Name,
                user_id: "",
                organization_id: $scope.params.name,
                //  payment_schedule_id: $scope.payment_type1,
                // media_name: uploadResult1.Name,
                bank_name:$scope.params.bank_name,
                payment_type_id: $scope.params.payment_type1,
                amount: $scope.params.amount,
                cheque_date: $scope.params.cheque_date,
              
                ////user_id: $cookieStore.get('userId'),
            };

            apiService.post("SubscriptionPayment/Create", postData).then(function (response) {
                var loginSession = response.data;
                alert("Payment Done...");

                $scope.openSucessfullPopup();

            },
         function (error) {

         });

            $scope.openSucessfullPopup = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'newuser/sucessfull.tpl.html',
                    backdrop: 'static',
                    controller: sucessfullController,
                    size: 'lg'
                });


            }

            $scope.params = {
                //payment_schedule_id:$scope.payment_type1,
                subscription_id: $scope.params.Subscription_Name,
                bank_name: $scope.bank_name,
                payment_type_id: $scope.payment_type1,
                amount: $scope.amount,
                cheque_date: $scope.cheque_date,
                user_id: "",
                organization_id: $scope.params.name,
                //contact_id: window.sessionStorage.selectedCustomerID,
            };

            var emp = {
                //  payment_type1: $scope.payment_type1,
                subscription_id: $scope.params.Subscription_Name,
                bank_name: $scope.bank_name,
                payment_type_id: $scope.payment_type1,
                amount: $scope.amount,
                cheque_date: $scope.cheque_date,
                user_id: "",
                organization_id: $scope.params.name,
                //contact_id: window.sessionStorage.selectedCustomerID,
            };
        }


        Url = "Payment/GetPayment";

        apiService.get(Url).then(function (response) {
            $scope.payment = response.data;

        },
    function (error) {
        console.log("Error " + error.state);
    });

        $scope.selectpay = function () {
            $scope.params.payment_type1 = $scope.pay1;
            //alert($scope.params.user_id);
        };


        Url = "Subscription/GetDropDown/" + $cookieStore.get('orgID');

        apiService.get(Url).then(function (response) {
            $scope.subscription = response.data;

        },
    function (error) {
        console.log("Error " + error.state);
    });

        $scope.selectsub = function () {
            $scope.params.Subscription_Name = $scope.sub1;
            //alert($scope.params.user_id);
        };




        Url = "Organization/Get/" + $cookieStore.get('orgID');  //2be7d37f-b2be-41ef-b479-679d168b666e

        apiService.get(Url).then(function (response) {
            $scope.organization = response.data;

        },
    function (error) {
        console.log("Error " + error.state);
    });

        $scope.selectorg = function () {
            $scope.params.name = $scope.org1;
            //alert($scope.params.user_id);
        };




        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {


                new ProjectCreate($scope.params).then(function (response) {
                    console.log(response);
                    $scope.showValid = false;
                    $state.go('guest.signup.thanks');
                }, function (error) {
                    console.log(error);
                });

                $scope.showValid = false;

            }

        }

    });

