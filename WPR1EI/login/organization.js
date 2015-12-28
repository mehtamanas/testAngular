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
    function ($scope, $state, COUNTRIES, apiService, $cookieStore) {
        $scope.countryList = COUNTRIES;
        $scope.breadcrumb = 1;
              
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

