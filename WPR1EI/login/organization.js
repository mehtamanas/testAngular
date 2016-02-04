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

        $(document).ready(function () {
            $("#orgz_name").focus();
        });
         
        $scope.Sub_Name = $cookieStore.get('Sub_Name');
        $scope.radioValue = "1";

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
        OrgName: $cookieStore.get('orgName'),
     
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
        $scope.params.name = $cookieStore.get('orgName');
        $scope.params.street_1 = $cookieStore.get('Street_1');
        $scope.params.street_2 = $cookieStore.get('Street_2');
        $scope.params.street_3 = $cookieStore.get('Street_3');
       
        $scope.params.state = $cookieStore.get('State');
        $scope.state1 = $cookieStore.get('State');
        $scope.params.city = $cookieStore.get('City');
        $scope.city1 = $cookieStore.get('City');
       
        $scope.params.zip_code = $cookieStore.get('zip_code');
        $scope.country1 = $cookieStore.get('Country');





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
            $scope.city1 = "";
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


        UserCreate = function (param) {
            //     alert('inuserCreate');
            var userNorg = "";

            userNorg = 'Register/UserWithOrg';
            apiService.post(userNorg, param).then(function (response) {
                var loginSession = response.data;
                //alert("Email has been sent for Approval..!! Login to Continue...");

                //                   alert("org_id" + loginSession.Organization_Id);
                $scope.organization.Id = loginSession.Organization_Id;
                $scope.subscription.organization_id = loginSession.Organization_Id;
                // alert('Org id - :' + $scope.organization.Id);
                $cookieStore.put('Organization_id', $scope.subscription.organization_id);
                new OrganizationEdit($scope.organization);


            },
               function (error) {
                   console.log("Error" + error.state);
               });
        };

        OrganizationEdit = function (paramsOrg) {
            //   alert('inOrgEdit');
            var orgEdit = "";
            orgEdit = 'Organization/CreateOrgAddress';
            apiService.post(orgEdit, paramsOrg).then(function (response) {
                var loginSession = response.data;
                //   alert("Organization has been Created..!!");   

                new SubscriptionCreate();

            },
                function (error) {
                    alert("User Already Exists.....Choose Another Email-id");
                });
        };

        SubscriptionCreate = function () {
            //  alert('inSubscription');
            var subCreate = "";
            subCreate = 'OrgSubscription/Create';


            //   alert($scope.subscription.organization_id);
            //alert($scope.subscription.Subscription_Name);

            apiService.post(subCreate, $scope.subscription).then(function (response) {
                var loginSession = response.data;

                //alert("Subscription has been Created..!!");

            },
                function (error) {
                    console.log("Error" + error.state);
                });
            $state.go('thanks');
        };

        $scope.organization = {
            Id: '',
            street_1: $cookieStore.get('Street_1'),
            street_2: $cookieStore.get('Street_2'),
            street_3: $cookieStore.get('Street_3'),
            city: $cookieStore.get('City'),
            state: $cookieStore.get('State'),
            zip_code: $cookieStore.get('zip_code'),
            country: $cookieStore.get('Country')
        };
        $scope.subscription = {
            organization_id: '',
            Subscription_Name: $scope.Sub_Name
        };

        $scope.params = {
            first_name: $cookieStore.get('First_Name'),
            last_name: $cookieStore.get('Last_Name'),
            account_email: $cookieStore.get('Account_Email'),
            account_phone: $cookieStore.get('Phone'),
            account_country: $cookieStore.get('Account_Country'),
            Password: $cookieStore.get('Hash'),
            OrgName: $cookieStore.get('orgName'),
            who_am_i: $cookieStore.get('who_am_i')
            //   Organization_Id: ''

        };


        $scope.addPersonalInfo = function (isValid) {
            $scope.showValid = true;
            if (isValid)
            {

                $cookieStore.put('orgName', $scope.params.name);
                $cookieStore.put('Street_1', $scope.params.street_1);
                $cookieStore.put('Street_2', $scope.params.street_2);
                $cookieStore.put('Street_3', $scope.params.street_3);
                $cookieStore.put('City', $scope.params.city);
                $cookieStore.put('State', $scope.params.state);
                $cookieStore.put('zip_code', $scope.params.zip_code);
                $cookieStore.put('Country', $scope.params.country);
                

                if ($scope.radioValue == 1) {
                    $cookieStore.put("who_am_i", "Broker");

                }
                else {
                    ($cookieStore.put("who_am_i", "Builder"));
                }
                
                $cookieStore.get('who_am_i')
                if ($rootScope.subscriptionType == "Basic")
                {

                    new UserCreate($scope.params);

                    $cookieStore.remove('First_Name');
                    $cookieStore.remove('Last_Name');
                    $cookieStore.remove('Account_Email');
                    $cookieStore.remove('Phone');
                    $cookieStore.remove('Account_Country');
                    $cookieStore.remove('orgName');
                    $cookieStore.remove('Street_1');
                    $cookieStore.remove('Street_2');
                    $cookieStore.remove('Street_3');
                    $cookieStore.remove('State');
                    $cookieStore.remove('City');
                    $cookieStore.remove('zip_code');
                    $cookieStore.remove('Country');
                    $state.go('thanks');
                }

                else
                {
                    $state.go('bill');
                }
                   
                $scope.showValid = false;

            }

        };
    }
);

