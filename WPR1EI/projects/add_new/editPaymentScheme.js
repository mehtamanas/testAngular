var EditPaymentSchemeController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $rootScope, $modal) {
    console.log('EditPaymentSchemeController');


    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    var payment_sch_id = $cookieStore.get('payment_schedule_id');
   
    //alert(payment_sch_id);
   

    $scope.showProgress = false;

    // FILTERS
  

    //Audit log start
   // $scope.params = {

   //     device_os: "windows10",
   //     device_type: "mobile",
   //     device_mac_id: "34:#$::43:434:34:45",
   //     module_id: "Wing",
   //     action_id: "Wing View",
   //     details: "ProjectDetail",
   //     application: "angular",
   //     browser: $cookieStore.get('browser'),
   //     ip_address: $cookieStore.get('IP_Address'),
   //     location: $cookieStore.get('Location'),
   //     organization_id: $cookieStore.get('orgID'),
   //     User_ID: $cookieStore.get('userId')
   // };


   // AuditCreate = function (param) {

   //     apiService.post("AuditLog/Create", param).then(function (response) {
   //         var loginSession = response.data;

   //     },
   //function (error) {

   //});
   // };
   // AuditCreate($scope.params);

    //end


    projectUrl = "Payment/GetPay_Sch_ByID/" + payment_sch_id;


    //alert(projectUrl);
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data[0];

     
    },
function (error) {
    console.log("Error " + error.state);
}
    );


    projectUrl = "Payment/GetPay_Sch_Detail_Multiple/" + payment_sch_id;

    //alert(projectUrl);
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.choices2 = response.data;

    


    },
function (error) {
    console.log("Error " + error.state);
}
    );


   
    $scope.choices2 = [{ id: 'choice1' }];
    $(document).on("click", ".remove-field", function () {
        $(this).parent().remove();
    });

    $scope.choices2 = [{ id: 'choice1' }];
    $scope.addNewChoice2 = function (e) {
        var classname = e.currentTarget.className;
        if (classname == 'remove-field') {
            // $scope.choices2.pop();
        }
        else if ($scope.choices2.length) {
            var newItemNo2 = $scope.choices2.length + 1;
            $scope.choices2.push({ 'id': 'choice' + newItemNo2 });
        }

    };





    paymentCreate = function (param) {

        var schemeupdate = [];
        var tot = 0;
        for (var i in $scope.choices2) {

            tot = tot + parseInt($scope.choices2[i].percentage);

        }
        if (tot > 100) {
            alert("cannot proceed...");
            return;
        }
        if (tot < 100) {
            alert("cannot proceed");
            return;
        }


        //var postData = {
        //    user_id: $cookieStore.get('userId'),
        //    organization_id: $cookieStore.get('orgID'),
        //    type_of_payment: $scope.params.Pay_Scheme_name,
        //    base_rate: $scope.params.base_rate,
        //    id: payment_schedule_id

        //};

        apiService.post("Payment/EditPaymentScheme", param).then(function (response) {
            var loginSession = response.data;
            var schemeupdate = [];
            for (var i in $scope.choices2) {
                var newscheme = {};

                // newscheme.user_id = $cookieStore.get('userId');
                // newscheme.organization_id = $cookieStore.get('orgID');
                newscheme.description = $scope.choices2[i].description;
                newscheme.percentage = $scope.choices2[i].percentage;
                //  newscheme.project_id = window.sessionStorage.selectedCustomerID;
                newscheme.id = $scope.choices2[i].payment_schedule_Detail_id;
                schemeupdate.push(newscheme);
            }

            apiService.post("Payment/EditPaymentScheduleDetail", schemeupdate).then(function (response) {
                $scope.choices2 = response.data;
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
        type_of_payment: $scope.type_of_payment,
        base_rate: $scope.base_rate,
        payment_sch_id : $cookieStore.get('payment_schedule_id'),
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId')
    };

    var emp = {

        type_of_payment: $scope.type_of_payment,
        base_rate: $scope.base_rate,
       
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

            var postData = {

                id: $scope.params.payment_sch_id,
                type_of_payment: $scope.params.type_of_payment,
                base_rate: $scope.params.base_rate,


            };

            new paymentCreate(postData).then(function (response) {
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