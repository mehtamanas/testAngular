angular.module('contacts')

.controller('peopertyQuote', function ($scope, $state, $cookieStore,apiService, $rootScope, $modal) {
    console.log('peopertyQuote');
    $rootScope.title = 'Dwellar-peopertyQuotes';
    var orgID = $cookieStore.get('orgID');
    var userId = $cookieStore.get('userId');
    $cookieStore.put("user_id", userId);
    $cookieStore.put("organizationId", orgID);

    //$scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    $cookieStore.put("customerId", window.sessionStorage.selectedCustomerID);

    Url = "PropertyQuotes/GetProject/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectproject = function () {
        $scope.projectList;
        $cookieStore.put("projectId", $scope.projectList)
        towerSelect();
    };

    var towerSelect = function () {
    
    Url = "PropertyQuotes/GetTower/" + $scope.projectList;
    apiService.get(Url).then(function (response) {
        $scope.towers = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.propertyDetail = {};
    $scope.selectTower = function () {

        towerDetails = JSON.parse($scope.towerList)
        $cookieStore.put("Tower_id", towerDetails)
        $scope.propertyDetail.towerName = towerDetails.tower_name
        $scope.towerList;
        wingSelect();
    };
    }

    var wingSelect = function () {

        Url = "PropertyQuotes/GetWing/" + towerDetails.tower_id + "/" + $scope.projectList;
        apiService.get(Url).then(function (response) {
            $scope.wings = response.data;
        },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });

        $scope.selectWing = function () {
            wingDetails = JSON.parse($scope.wingList)
            $cookieStore.put("wing_id", wingDetails);
            $scope.propertyDetail.wingName = wingDetails.wing_name
            $scope.wingList;
            floorSelect();
        };
    }



    var floorSelect = function () {

        Url = "PropertyQuotes/GetFloor/" + wingDetails.wing_id  + "/"+ towerDetails.tower_id +"/"+ $scope.projectList;
        apiService.get(Url).then(function (response) {
            $scope.floors = response.data;
        },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });

        $scope.selectFloor = function () {
            floorDetails = JSON.parse($scope.floorList)
            $cookieStore.put("floor_id", floorDetails);
            $scope.propertyDetail.floorNo = floorDetails.floor_no
            $scope.floorList;
            unitSelect();
        };
    }

    var unitSelect = function () {

        Url = "PropertyQuotes/GetUnit/" + floorDetails.floor_id + "/" + wingDetails.wing_id + "/" + towerDetails.tower_id + "/" + $scope.projectList;
        apiService.get(Url).then(function (response) {
            $scope.units = response.data;
        },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });

        $scope.selectUnit = function () {
            unitDetails = JSON.parse($scope.unitList)

            $cookieStore.put("unitDescription", unitDetails)
            $scope.propertyDetail.unitNo = unitDetails.unit_no;
            $scope.propertyDetail.unitName = unitDetails.unit_name;
            $scope.propertyDetail.CarpatArea = unitDetails.carpet_area;
            $scope.propertyDetail.salableArea = unitDetails.scalable_area;
            $scope.propertyDetail.CarePark = unitDetails.car_park;
            $scope.propertyDetail.Rps = unitDetails.rate_per_sqft;
            $scope.propertyDetail.Fra = unitDetails.floor_rise_appicable;
            $scope.propertyDetail.total_considarationValue = unitDetails.total_consideration;
            $scope.propertyDetail.unitList;
            $cookieStore.put("PropertyDetails", $scope.propertyDetail);
            paymentScheme();
           

        };
    }




  

    var paymentScheme = function () {

        Url = "Payment/Get?id=" + orgID;
        apiService.get(Url).then(function (response) {
            $scope.paymentType = response.data;

            $cookieStore.put("PaymentScheme", $scope.paymentType);
        },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });
    }
    $scope.selectPayment = function () {
        $scope.paymentList;
        $cookieStore.put("PaymentScheduled", $scope.paymentList);
 
        schemeDetails();

    };

    var schemeDetails = function () {

        Url = "Payment/GetPay_Sch_Detail_Multiple/" + $scope.paymentList;
        apiService.get(Url).then(function (response) {
            $scope.schemeDetails = response.data;
            $cookieStore.put("PaymentDetails", $scope.schemeDetails);
        },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });
    }
 
    $scope.addNew = function () {
        
        $state.go('app.property_CustomizQuote');
    }

});

