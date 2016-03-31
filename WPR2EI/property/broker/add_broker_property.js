angular.module('property')
.controller('brokerPropertyController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('brokerPropertyController');

        var userId = $cookieStore.get('userId');
        var orgID = $cookieStore.get('orgID');

        $scope.choices1 = [{ id: 'choice1' }]; 
        $scope.addNewChoice1 = function (e) {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field') {
                $scope.choices1.pop();
            }
            else if ($scope.choices1.length < 2) {
                var newItemNo = $scope.choices1.length + 1;
                $scope.choices1.push({ 'id': 'choice' + newItemNo });
            }
        };

        Url = "GetCSC/state";
        apiService.get(Url).then(function (response) {
            $scope.states = response.data;
        },
    function (error) {
        alert("Error " + error.state);
    });

        $scope.selectstate = function () {
            $scope.params.state = $scope.state1;
        };

        Url = "GetCSC/city";
        apiService.get(Url).then(function (response) {
            $scope.cities = response.data;
        },
        function (error) {
        alert("Error " + error.cities);
        });

        $scope.filterExpression = function (city) {
            return (city.stateid === $scope.params.state);
        };


        Url = "Broker/GetPC";
        apiService.get(Url).then(function (response) {
            $scope.properties = response.data;
         },
         function (error) {
         alert("Error " + error.state);
         });

        Url = "Broker/GetPV";
        apiService.get(Url).then(function (response) {
            $scope.views = response.data;
        },
         function (error) {
             alert("Error " + error.state);
         });

        Url = "Broker/GetLS";
        apiService.get(Url).then(function (response) {
            $scope.sources = response.data;
        },
         function (error) {
             alert("Error " + error.state);
         });

     

        //function call
        $scope.selectdeposit = function () {
            $scope.params.deposit_required = $scope.deposit1;
        };

        $scope.selectdepodit_type = function () {
            $scope.params.deposit_type = $scope.depositType1;
        };

        $scope.selectModePayment = function () {
            $scope.params.mode_of_payment = $scope.payment1;
        };

        $scope.selectBrokerage = function () {
            $scope.params.licensee_brokerage_type = $scope.brokerage1;
        };

        $scope.selectPeriod = function () {
            $scope.params.rent_escalation_period = $scope.period1;
        };

        $scope.selectRentEscType = function () {
            $scope.params.rent_escalation_type = $scope.rentEscType1;
        };

        $scope.save = function () {
            var postData = {
                user_id: $cookieStore.get('userId'),
                organization_id: $cookieStore.get('orgID'),
                base_rent: $scope.params.base_rent,
                advanced_rent: $scope.params.advanced_rent,
                monthly_rent: $scope.params.monthly_rent,
                deposit_required:  $scope.params.deposit_required,
                deposit_amount: $scope.params.deposit_amount,
                sale_price_per_sqft: $scope.params.sale_price_per_sqft,
                car_park_rate: $scope.params.car_park_rate,
                sale_price_for_car_park: $scope.params.sale_price_for_car_park,
                licensee_brokerage_type: $scope.params.licensee_brokerage_type,
                licensee_brokerage: $scope.params.licensee_brokerage,
                rent_escalation_period: $scope.params.rent_escalation_period,
                rent_escalation_type: $scope.params.rent_escalation_type,
                rent_escalation_amount: $scope.params.rent_escalation_amount,
            };

            apiService.post("Payment/Create", postData).then(function (response) {
                var loginSession = response.data;
               
            },
            function (error) {
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");

            });
        }

        Url = "Amenities/GetAmenities?id=" + orgID;
        apiService.get(Url).then(function (response) {
            $scope.orgAmenities = response.data;
        },
       function (error) {

       });
       
    });