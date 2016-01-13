angular.module('app.guest.login')

    .config(function config($stateProvider) {
        $stateProvider
            .state('organization', {
                url: '/organization',
                templateUrl: 'login/organization.tpl.html',
                controller: 'OController',
                data: { pageTitle: 'organization' }
            });
    })

    .controller('OController',
    function ($scope, $state, COUNTRIES, apiService, $cookieStore, $rootScope) {
        $scope.countryList = COUNTRIES;
        $scope.breadcrumb = 1;
         
   

        $rootScope.title = 'Dwellar./Organization';
        $scope.signup = function () {
            $state.go('signup_free_account');
            
            $scope.signupfree.first_name;
            $scope.signupfree.last_name;
            $scope.signupfree.account_email;
            $scope.signupfree.account_phone;
            $scope.signupfree.account_country;

        };

        $scope.signupfree =
       {
        first_name: $cookieStore.get('First_Name'),
        last_name: $cookieStore.get('Last_Name'),
        account_email: $cookieStore.get('Account_Email'),
        account_phone: $cookieStore.get('Phone'),
        account_country: $cookieStore.get('Account_Country'),
        Password: $cookieStore.get('Hash'),
        OrgName: $cookieStore.get('OrgName'),
     
        };
      
   

        // Init model
        $scope.params = {
            name: $scope.name,
            street_1: $scope.street_1,
            street_2: $scope.street_2,
            street_3: $scope.street_3,
            city: $scope.city,
            state: $scope.state,
            zip_code: $scope.zip_code,
            country: $scope.country,
            who_am_i: $scope.who_am_i
            
        };
        var emp = {
            name: $scope.name,
            street_1: $scope.street_1,
            street_2: $scope.street_2,
            street_3: $scope.street_3,
            city: $scope.city,
            state: $scope.state,
            zip_code: $scope.zip_code,
            country:$scope.country
            
        };

        $scope.confirms = {
            hash: $scope.hash
        };


        Url = "GetCSC/Country";

        apiService.get(Url).then(function (response) {
            $scope.countries = response.data;

        },
    function (error) {
        console.log("Error " + error.country);
    });


        $scope.selectcountry = function () {
            $scope.params.country = $scope.country1;
            //alert($scope.params.country);
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
            //alert($scope.params.state);
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


        $scope.selectcity = function () {
            $scope.params.city = $scope.city1;
            //alert($scope.params.city);
        };

        $scope.addPersonalInfo = function (isValid) {
            if (isValid) {

                $cookieStore.put('OrgName', $scope.params.name);
                $cookieStore.put('Street_1', $scope.params.street_1);
                $cookieStore.put('Street_2', $scope.params.street_2);
                $cookieStore.put('Street_3', $scope.params.street_3);
                $cookieStore.put('City', $scope.params.city);
                $cookieStore.put('State', $scope.params.state);
                $cookieStore.put('Zip_code', $scope.params.zip_code);
                $cookieStore.put('Country', $scope.params.country);
                $cookieStore.put('who_am_i', $scope.params.who_am_i);

                if ($scope.radioValue == 1) {
                    $cookieStore.put("who_am_i", "Broker");

                }
                else {
                    ($cookieStore.put("who_am_i", "Builder"));
                }

                //alert("hi bill");

                //alert('Name : ' + $cookieStore.get('Name'));
                //alert('Street_1 : ' + $cookieStore.get('Street_1'));
                //alert('Street_2 : ' + $cookieStore.get('Street_2'));
                //alert('Street_3 : ' + $cookieStore.get('Street_3'));
                //alert('City : ' + $cookieStore.get('City'));
                //alert('State : ' + $cookieStore.get('State'));
                //alert('Zip_code : ' + $cookieStore.get('Zip_code'));
                
             //   alert('Type : ' + $cookieStore.get('who_am_i'));
                $cookieStore.get('who_am_i')
                $state.go('bill');


            }

        };
    }
);

