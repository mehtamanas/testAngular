var addNewServiceController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $window, $rootScope, $modal) {
    console.log('addNewServiceController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    var orgID = $cookieStore.get('orgID');
    var userId = $cookieStore.get('userId');

    $scope.Service1;
    $scope.serviceType = [];


    //Audit log start															
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "AddProject Payment",
           details: $scope.params.Pay_Scheme_name + "AddPayment",
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


    

    $scope.ServicePost = function () {

        // TODO: Need to get these values dynamically
        var post = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            project_id: window.sessionStorage.selectedCustomerID,
            name: $scope.params.name,
            description: $scope.description,
            price: $scope.params.price,
            tax_value: $scope.final_tax,
            final_amount: $scope.final_Total,

        };



        apiService.post("Services/Create", post).then(function (response) {
            var loginSession = response.data;
            AuditCreate();
            var service = [];


            for (var i in $scope.quotes2) {
                var newService = {};

                newService.project_service_id = loginSession.id;
                newService.charges_amt = $scope.serviceType[i].amount;
                newService.charges_id = $scope.serviceType[i].id;
                newService.user_id = $cookieStore.get('userId'),
                newService.organization_id = $cookieStore.get('orgID'),
                service.push(newService);
            }
            apiService.post("Services/CreateTaxMapping", service).then(function (response) {
                var loginSession = response.data;
                alert("Service Created...");
                $rootScope.$broadcast('REFRESH', 'serviceGrid');
                called = true;
                $modalInstance.dismiss();
                //$scope.openSucessfullPopup();

            },
            function (error) {
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });

            //  alert("Tower Done...");
            $modalInstance.dismiss();

        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });

    }

    Url = "Services/GetCharges?id=" + window.sessionStorage.selectedCustomerID;
    apiService.get(Url).then(function (response) {
        $scope.taxes = response.data;
    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);

});



    $scope.selectService = function (index) {
        var j = _.findIndex($scope.taxes, function (o) { return o.id == $scope.serviceType[index].id; });
        $scope.serviceType[index].charge = (_.findWhere($scope.taxes, { id: $scope.serviceType[index].id })).charge_percentage;
        var calcType = (_.findWhere($scope.taxes, { id: $scope.serviceType[index].id })).calculation_type;
        if (calcType === 'Basic')
            basicTotal(j, index);
        else
            previousTotal(j, index)

    };

    //var calculateQuote = function (j, index) { //for total calculation
    //    if ($scope.taxes[j].calculation_type == "Basic") {
    //        if ($scope.taxes[j].charge == "Percent") {
    //            $scope.serviceType[index].amount = (parseFloat($scope.params.price) * parseFloat($scope.taxes[j].charge_percentage) / 100);
    //        }
    //        else {
    //            $scope.serviceType[index].amount = (parseFloat($scope.taxes[j].charge_percentage));
    //        }
    //    }
    //    else //prev calc
    //    {
           
    //    }

    //    $scope.Tax_total = $scope.serviceType[index].amount;
    //    calculateGrandTotal(index);
    //}
    var basicTotal = function (j, index) { //for total calculation
            if ($scope.taxes[j].charge == "Percent") {
                $scope.serviceType[index].tax = (parseFloat($scope.params.price) * parseFloat($scope.taxes[j].charge_percentage) / 100);
            }
            else {
                $scope.serviceType[index].tax = (parseFloat($scope.taxes[j].charge_percentage));
            }

            $scope.Tax_total = $scope.serviceType[index].tax;
               calculateGrandTotal(index);
    }

   
    $scope.final_Total = 0;

    var previousTotal = function (j, index) {
        if ($scope.taxes[j].charge == "Percent") {
            if (index == 0) {
                $scope.serviceType[index].tax = (parseFloat($scope.params.price) * parseFloat($scope.serviceType[index].charge) / 100);
            }
            else {
                $scope.serviceType[index].tax = (parseFloat($scope.serviceType[index-1].totalAmt) * parseFloat($scope.serviceType[index].charge) / 100);
            }
        }
        else {
            $scope.serviceType[index].tax = (parseFloat($scope.serviceType[index].charge));
        }
        $scope.Tax_total = $scope.serviceType[index].tax;
        calculateGrandTotal(index);
    }


    var calculateGrandTotal = function (index) {//for grand total calculation

        if (index == 0) {
            $scope.serviceType[index].totalAmt = (parseFloat($scope.Tax_total) + parseFloat($scope.params.price));
        }
        else {
            $scope.serviceType[index].totalAmt = (parseFloat($scope.serviceType[index - 1].totalAmt)) + (parseFloat($scope.Tax_total));

        }
        $scope.serviceType[index].totalAmt.toFixed(2)//for 2 decimal digits

        finalTax()
    }

    $scope.quotes = [{ id: 'choice1' }];

    $scope.quotes2 = [{ id: 'choice1' }];

    $scope.addNewquote2 = function (e) {
        var classname = e.currentTarget.className;
        if (classname == 'remove-field') {
            if ($scope.quotes2.length > 1) {
                $scope.quotes2.pop();
            }
        }
        else if ($scope.quotes2.length) {
            var newItemNo2 = $scope.quotes2.length + 1;
            $scope.quotes2.push({ 'id': 'choice' + newItemNo2 });
        }

    };

 


    var finalTax = function () {//for grand total calculation
        $scope.final_tax = 0;
        $scope.final_Total = 0;
        for (i = 0; i < $scope.serviceType.length; i++) {

            $scope.final_tax = ($scope.final_tax) + $scope.serviceType[i].tax;
            $scope.final_Total = ($scope.final_Total) + $scope.serviceType[i].totalAmt;
        }

        //  alert($scope.final_tax);
        //alert($scope.final_Total);
    }



    $scope.$watch('params.price', function (oldvalue, newvalue) {
        for (j = 0; j < $scope.serviceType.length; j++) {
            basicTotal(j);
            previousTotal(j);
            calculateGrandTotal(j);
            finalTax(j);

        }

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
        $rootScope.$broadcast('REFRESH', 'payment');
    };



    $scope.params = {
        name: $scope.name,
        description: $scope.description,
        project_id: window.sessionStorage.selectedServiceID,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        price: $scope.price,
        charges_id: $scope.Service1,
        tax_value: $scope.tax_value,
    };




    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    ////$scope.reset = function () {
    ////    $scope.params = {};
    ////}

  

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {

            $scope.showValid = false;

        }

    }

};