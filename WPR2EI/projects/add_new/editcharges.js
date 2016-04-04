var EditChargesController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $rootScope, $modal) {
    console.log('EditChargesController');


    $scope.chargeId = window.sessionStorage.chargeId
    var orgID = $cookieStore.get('orgID');
    var userId = $cookieStore.get('userId');
    $scope.chargetype = [];
    $scope.caltype = [];

    GetUrl = "Charges/EditGet/" + $scope.chargeId;
    apiService.getWithoutCaching(GetUrl).then(function (response, id) {
        $scope.choices2 = response.data;
        for (var j in $scope.choices2)
        {
            $scope.chargetype.push({ id: $scope.choices2[j].charge_type_id});
            $scope.caltype.push({ id: $scope.choices2[j].calculation_type });
        }
        if ($scope.chargetype[0].id == 'EE3B05C9-D14A-4179-9D48-166D503F8E11') {
            $scope.chargetype[0].enable = true;

        }
       
    },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    }
  );



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

    $(document).on("click", "remove-field0", function () {
        var removed1 = $(this).parent().find('#Charge_name_Type_name').val();
        var removed2 = $(this).parent().find('#charge_type').val();
        var removed3 = $(this).parent().find('#no_of_months').val();
        var removed4 = $(this).parent().find('#category_type_name').val();
        var removed5 = $(this).parent().find('#charge_value').val();
        var fnd = 0;
        for (var i in $scope.choices2) {
            if (removed1 == $scope.choices2[i].Charge_name_Type_name && removed2 == $scope.choices2[i].charge_type && removed3 == $scope.choices2[i].no_of_months && removed4 == $scope.choices2[i].category_type_name && removed5 == $scope.choices2[i].charge_value) {
                $scope.choices2.splice(i, 1);
                fnd = 1;
            }

        }
        $(this).parent().remove();
    });



    $scope.choices = [{ id: 'choice1' }];

    $scope.addNewChoice = function () {
        var newItemNo = $scope.choices.length + 1;
        $scope.choices.push({ 'id': 'choice' + newItemNo });
    };


    $scope.choices2 = [{ id: 'choice1' }];



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

    $scope.paymentCreate = function () {


        var schemeupdate = [];
        for (var i in $scope.choices2) {
            var newscheme = {};
            
            newscheme.user_id = $cookieStore.get('userId');
            newscheme.organization_id = $cookieStore.get('orgID');
            newscheme.category_type_name = $scope.choices2[i].category_type_name;
            newscheme.Charge_name_Type_name = $scope.choices2[i].Charge_name_Type_name;
            newscheme.no_of_months = $scope.choices2[i].no_of_months;
            if (newscheme.no_of_months == undefined) {
                newscheme.no_of_months = "0";
            }

            newscheme.project_id = window.sessionStorage.selectedCustomerID;
            newscheme.Charge_Type_id = $scope.chargetype[i].id;
            newscheme.calculation_type = $scope.caltype[i].id;
            newscheme.charge_value = $scope.choices2[i].charge_value;
            newscheme.charge_name_type_id = $scope.chargeId;
            schemeupdate.push(newscheme);
        }

        apiService.post("Charges/EditMultiple", schemeupdate).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'ChargesGrid');
        },
     function (error) {
         if (error.status === 400)
             alert(error.data.Message);
         else
             alert("Network issue");

     });


    }

    Url = "Charges/GetCharge_Type"
    apiService.get(Url).then(function (response) {
        $scope.types = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectctype = function (id, $index) {

        if (id == 'EE3B05C9-D14A-4179-9D48-166D503F8E11') {
            $scope.chargetype[$index].enable = true;

        }
        else {
            $scope.chargetype[$index].enable = false;
            $scope.chargetype[$index].value = null;
            for (var i in $scope.choices2)
            {
                $scope.choices2[i].no_of_months = "0";
            }
          
        }

        $scope.chargetype.id = $scope.chargetype[$index].id;
     
    };

    $scope.caltypes = [];

    $scope.caltypes.push('Previous Total');
    $scope.caltypes.push('Basic');

    $scope.selectyear = function ($index) {
        $scope.caltype.id = $scope.caltype[$index].id;
        //alert($scope.params.month);
    };

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/Edited.tpl.html',
            backdrop: 'static',
            controller: EditsucessfullController,
            size: 'md',
            resolve: { items: { title: "Charges" } }
        });

       
    }



    $scope.params = {
        Charge_Type_id: $scope.Charge_Type_id,
        Charge_name_Type_name: $scope.Charge_name_Type_name,
        category_type_name: $scope.category_type_name,
        no_of_months: $scope.no_of_months,
        charge_value: $scope.charge_value,
        calculation_type: $scope.calculation_type,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId')
    };

    var emp = {

        Charge_Type_id: $scope.Charge_Type_id,
        Charge_name_Type_name: $scope.Charge_name_Type_name,
        category_type_name: $scope.category_type_name,
        no_of_months: $scope.no_of_months,
        charge_value: $scope.charge_value,
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