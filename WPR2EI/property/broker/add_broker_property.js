angular.module('property')
.controller('brokerPropertyController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('brokerPropertyController');

        var userId = $cookieStore.get('userId');
        var orgID = $cookieStore.get('orgID');
        $scope.showRenewalDate = {};
        $scope.showLeased == {};

        $scope.checkedIds = [];

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

        $scope.choices2 = [{ id: 'choice1' }];
        $scope.addNewChoice2 = function (e) {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field') {
                $scope.choices2.pop();
            }
            else if ($scope.choices2.length < 2) {
                var newItemNo = $scope.choices2.length + 1;
                $scope.choices2.push({ 'id': 'choice' + newItemNo });
            }
        };

        $scope.choices3 = [{ id: 'choice1' }];
        $scope.addNewChoice3 = function (e) {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field') {
                $scope.choices3.pop();
            }
            else if ($scope.choices3.length < 2) {
                var newItemNo = $scope.choices3.length + 1;
                $scope.choices3.push({ 'id': 'choice' + newItemNo });
            }
        };

        projectUrl = "Form/GenerateFormId";
        apiService.getWithoutCaching(projectUrl).then(function (response) {
            $scope.params = response.data;
           
        },
       function (error) {
        alert("Error " + error.state);
       });

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

        Url = "Broker/GetFurnishing";
        apiService.get(Url).then(function (response) {
            $scope.furnish = response.data;
        },
         function (error) {
             alert("Error " + error.state);
         });

        Url = "Broker/GetAvailablity";
        apiService.get(Url).then(function (response) {
            $scope.availability = response.data;
        },
         function (error) {
             alert("Error " + error.state);
         });

        Url = "Broker/GetSubpeopleType";
        apiService.get(Url).then(function (response) {
            $scope.contacts = response.data;
        },
         function (error) {
             alert("Error " + error.state);
         });

        //function call

        $scope.selectfurnish = function () {
            $scope.params.furnishing_id = $scope.furnish1;
        };

        $scope.selectView = function () {
            $scope.params.property_view_id = $scope.view1;
        };

        $scope.selectAvailabilty = function () {
            $scope.params.availability_id = $scope.available1;
            //var availabiltyType = (_.findWhere($scope.availability, { id: $scope.available1 })).type
            //if (availabiltyType == "Leased") {
            //    $scope.showRenewalDate == 'false';
            //    $scope.showLeased == 'true';
            //}
            //else if (availabiltyType == "Available From:Date") {
            //    $scope.showRenewalDate == 'true';
            //    $scope.showLeased == 'false';
            //}
           
        };


        $scope.selectLeasePeriod = function () {
            $scope.params.lease_period = $scope.leasePeriod1;
        };


        $scope.selectAgreement = function () {
            $scope.params.type_of_agreement = $scope.agreement1;
        };


        $scope.selectPropertyCondition = function () {
            $scope.params.property_condition_id = $scope.properyCondition1;
        };


        $scope.selectListingSource = function () {
            $scope.params.listing_source_id = $scope.listSource1;
        };

        $scope.selectcity = function () {
            $scope.params.city = $scope.city1;
        };

        $scope.selectstate = function () {
            $scope.params.state = $scope.state1;
        };

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

        $scope.selectRentEscPeriod = function () {
            $scope.params.rent_escalation_period = $scope.rentEscperiod1;
        };

        $scope.selectRentEscType = function () {
            $scope.params.rent_escalation_type = $scope.rentEscType1;
        };
        
        $scope.selectContactType = function () {
            $scope.params.subpeople_type_id = $scope.contactType1;
        };

        $scope.save = function () {
         
            $scope.selectedAmenitiesId = [];
            var selectedAmenities = _.filter($scope.orgAmenities, function (o) { return o.checkedd; });
            selectedAmenitiesId = _.pluck(selectedAmenities, 'id');
            var amentiesList = [];
            for (i = 0; i < selectedAmenitiesId.length; i++)
            {
                amentiesList.push
                    ({
                        amenity_type_id: selectedAmenitiesId[i],
                        checkedd: "1",
                    })
            }

            var AgentPhone = [];
            for (i = 0; i < $scope.choices2.length; i++) {
                AgentPhone.push({
                agent_name: $scope.params.name,
                agent_phone_no: $scope.choices2[i].agent_phone_no
               
            })
            }

            var AgentEmail = [];
            for (i = 0; i < $scope.choices3.length; i++) {
                AgentEmail.push({
                                        
                    email: $scope.choices3[i].email
                })
            }

            var AgentList = [];
            AgentList = _.merge(AgentPhone, AgentEmail);

            var address = [];
            var newadd = {};

            for (i = 0; i < $scope.choices1.length; i++) {
                if (i == 0) {
                    if ($scope.choices1[0].Street_1 != undefined)
                        newadd.Street_1 = $scope.choices1[0].Street_1;
                }
                else if (i == 1) {
                    if ($scope.choices1[1].Street_1 != undefined)
                        newadd.Street_2 = $scope.choices1[1].Street_1;
                }
            }

            var dDate = moment($scope.params.possassion_date, "DD/MM/YYYY hh:mm A")._d;
            var creDate = moment($scope.params.created_date, "DD/MM/YYYY hh:mm A")._d;
            var leaseDate = moment($scope.params.renewal_of_lease, "DD/MM/YYYY hh:mm A")._d;

           
            var postData = {
                user_id: $cookieStore.get('userId'),
                organization_id: $cookieStore.get('orgID'),
                sale_type: $scope.radioValue,
                property_type: $scope.radio1,
                serial_no: $scope.params.random_id,
                num_bedrooms: $scope.params.num_bedrooms,
                num_bathrooms: $scope.params.num_bathrooms,
                Agreement_area: $scope.params.Agreement_area,
                Build_up_area: $scope.params.Build_up_area,
                furnishing_id: $scope.params.furnishing_id,
                floor_num: $scope.params.floor_num,
                car_park_id: $scope.params.car_park_id,
                property_view_id: $scope.params.property_view_id,
                availability_id: $scope.params.availability_id,
                lease_period: $scope.params.lease_period,
                listing_source_id: $scope.params.listing_source_id,
                type_of_agreement: $scope.params.type_of_agreement,
                building: $scope.params.building,
                city: $scope.params.city,
                state: $scope.params.state,
                zip_code: $scope.params.zip_code,
                locality: $scope.params.locality,
                base_rent: $scope.params.base_rent,
                advanced_rent: $scope.params.advanced_rent,
                monthly_rent: $scope.params.monthly_rent,
                deposit_required: $scope.params.deposit_required,
                deposit_type: $scope.params.deposit_type,
                deposit_amount: $scope.params.deposit_amount,
                mode_of_payment: $scope.params.mode_of_payment,
                sale_price_per_sqft: $scope.params.sale_price_per_sqft,
                car_park_rate: $scope.params.car_park_rate, 
                sale_price_for_car_park: $scope.params.sale_price_for_car_park,
                licensee_brokerage_type: $scope.params.licensee_brokerage_type,
                licensee_brokerage: $scope.params.licensee_brokerage,
                rent_escalation_period: $scope.params.rent_escalation_period,
                rent_escalation_type: $scope.params.rent_escalation_type,
                rent_escalation_amount: $scope.params.rent_escalation_amount,
                subpeople_type_id: $scope.params.subpeople_type_id,
                first_name: $scope.params.first_name,
                last_name: $scope.params.last_name,
                Street_1: newadd.Street_1,
                Street_2: newadd.Street_2,
                phone_no: $scope.params.phone_no,
                candid_comments: $scope.params.candid_comments,
                client_comments: $scope.params.client_comments,
                possassion_date: new Date(dDate).toISOString(),
                created_date: new Date(creDate).toISOString(),
                renewal_of_lease: new Date(leaseDate).toISOString(),
                amentiesList: amentiesList,
                AgentList: AgentList,
            };

            
            apiService.post("Broker/Create", postData).then(function (response) {
                var loginSession = response.data;
                alert("Property Added Successfully..")
               
            },
            function (error) {
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });
        }

        Url = "Broker/GetAgent/" + orgID;
        apiService.get(Url).then(function (response) {
            $scope.agentList = response.data;
            $scope.agentList = _.pluck($scope.agentList, 'name');
        },
    function (error) {
        alert("Error " + error.state);
    });


        Url = "Broker/GetAmenitiesallBroker" 
        apiService.get(Url).then(function (response) {
            $scope.orgAmenities = response.data;
            for (i = 0; i < $scope.orgAmenities.length; i++) {
                if ($scope.orgAmenities[i].checkedd===null) {
                    $scope.orgAmenities[i].checkedd = false;
                   
                }
            }
        },
       function (error) {

       });
      
 
        
    });