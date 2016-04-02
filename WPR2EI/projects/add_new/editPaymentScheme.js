var EditPaymentSchemeController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $rootScope, $modal) {
    console.log('EditPaymentSchemeController');


    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    var payment_sch_id = $cookieStore.get('payment_schedule_id');

    //alert(payment_sch_id);


    $scope.showProgress = false;

    // FILTERS


    //Audit log start															
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "EditProject Payment",
           details: $scope.params.type_of_payment + "AddPayment",
           application: "angular",
           browser: $cookieStore.get('browser'),
           ip_address: $cookieStore.get('IP_Address'),
           location: $cookieStore.get('Location'),
           organization_id: $cookieStore.get('orgID'),
           User_ID: $cookieStore.get('userId'),

       };


        apiService.post("AuditLog/Create", postdata).then(function (response) {
            var loginSession = response.data;
        },
    function (error) {
    });
    };


    //end


    projectUrl = "Payment/GetPay_Sch_ByID/" + payment_sch_id;


    //alert(projectUrl);
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data[0];


    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
}
    );


    projectUrl = "Payment/GetPay_Sch_Detail_Multiple/" + payment_sch_id;

    //alert(projectUrl);
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.choices2 = response.data;




    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
}
    );



    $scope.choices2 = [{ id: 'choice1' }];
    $(document).on("click", ".remove-field", function () {
        var removed = $(this).parent().find('#editnewpayement_milestone').val();
        var removed1 = $(this).parent().find('#editnewpayement_percentage').val();
        var fnd = 0;
        for (var i in $scope.choices2) {
            if (removed == $scope.choices2[i].description && removed1 == $scope.choices2[i].percentage) {
                $scope.choices2.splice(i, 1);
                fnd = 1;
            }

        }
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





    $scope.paymentCreate = function () {

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



        var postData = {

            id: $scope.params.payment_sch_id,
            type_of_payment: $scope.params.type_of_payment,
            base_rate: $scope.params.base_rate,


        };

        apiService.post("Payment/EditPaymentScheme", postData).then(function (response) {
            var loginSession = response.data;
            AuditCreate();
            var schemeupdate = [];
            for (var i in $scope.choices2) {
                var newscheme = {};

                newscheme.user_id = $cookieStore.get('userId');
                newscheme.organization_id = $cookieStore.get('orgID');
                newscheme.description = $scope.choices2[i].description;
                newscheme.percentage = $scope.choices2[i].percentage;
                newscheme.project_id = window.sessionStorage.selectedCustomerID;
                newscheme.id = $scope.choices2[i].payment_schedule_Detail_id;
                newscheme.payment_schedule_id = $cookieStore.get('payment_schedule_id');

                schemeupdate.push(newscheme);
            }

            apiService.post("Payment/EditPaymentScheduleDetail", schemeupdate).then(function (response) {
                var loginSession = response.data;
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
            },
         function (error) {
             if (error.status === 400)
                 alert(error.data.Message);
             else
                 alert("Network issue");
         });



        },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });
    }

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/Edited.tpl.html',
            backdrop: 'static',
            controller: EditsucessfullController,
            size: 'lg',
            resolve: { items: { title: "Payment" } }

        });
        $rootScope.$broadcast('REFRESH', 'payment');
    };


    $scope.params = {
        type_of_payment: $scope.type_of_payment,
        base_rate: $scope.base_rate,
        payment_sch_id: $cookieStore.get('payment_schedule_id'),
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


            $scope.paymentCreate();


            $scope.showValid = false;

        }

    }

};