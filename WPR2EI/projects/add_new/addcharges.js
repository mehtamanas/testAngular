var ChargesController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $rootScope, $modal) {
    console.log('ChargesController');


    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    var userId = $cookieStore.get('userId');

    //Audit log start
    $scope.params = {

        device_os: "windows10",
        device_type: "mobile",
        module_id: "Project",
        action_id: "Project View",
        details: "Add Charges",
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


    $scope.choices2 = [{ id: 'choice1' }];
    $(document).on("click", ".remove-field0", function () {

    });

    $scope.choices2 = [{ id: 'choice1' }];
    $scope.addNewChoice2 = function (e) {
        var classname = e.currentTarget.className;
        if (classname == 'remove-field0') {

            $scope.choices2.pop();
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

        if (tot != 100) {
            //alert("cannot proceed...");
            $scope.openUnsucessPopup();
            return;
        }
        else {

            apiService.post("Payment/Add_new_Payment_scheme", param).then(function (response) {
                var loginSession = response.data;
                var schemeupdate = [];
                for (var i in $scope.choices2) {
                    var newscheme = {};

                    newscheme.user_id = $cookieStore.get('userId');
                    newscheme.organization_id = $cookieStore.get('orgID');
                    newscheme.Milestone = $scope.choices2[i].Milestone;
                    newscheme.percentage = $scope.choices2[i].percentage;
                    newscheme.project_id = window.sessionStorage.selectedCustomerID;
                    newscheme.payment_schedule_id = loginSession.id;
                    schemeupdate.push(newscheme);
                }

                apiService.post("Payment/new_Paymnt_scheme_Milestn", schemeupdate).then(function (response) {
                    $scope.choices2 = response.data;
                    $modalInstance.dismiss();
                    $scope.openSucessfullPopup();
                },
             function (error) {
                 if (error.status === 400)
                     alert(error.data.Message);
                 else
                     alert("Network issue");

             });
                $scope.total = tot;
                $modalInstance.dismiss();

            },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");

});


        }



    }


    Url = "Charges/GetCharge_Type"
    apiService.get(Url).then(function (response) {
        $scope.types = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectctype = function () {
        $scope.params.Charge_Type_id = $scope.type1;
    };

  

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Payment" } }

        });
        $rootScope.$broadcast('REFRESH', 'payment');
    };

    $scope.openUnsucessPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/unsuccess.tpl.html',
            backdrop: 'static',
            controller: UnsucessController,
            size: 'md'

        });

        $rootScope.$broadcast('REFRESH', 'payment');
    };

    $scope.params = {
        Charge_Type_id: $scope.Charge_Type_id,
        Charge_name_Type_name: $scope.Charge_name_Type_name,
        category_type_name: $scope.category_type_name,
        no_of_months:$scope.no_of_months,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId')
    };

    var emp = {

        Charge_Type_id: $scope.Charge_Type_id,
        Charge_name_Type_name: $scope.Charge_name_Type_name,
        category_type_name: $scope.category_type_name,
        no_of_months: $scope.no_of_months,
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