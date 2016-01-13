angular.module('app.guest.login')//to chnage

      .config(function config($stateProvider) {
          $stateProvider
              .state('bill', {
                  url: '/bill',
                  templateUrl: 'login/bill.tpl.html',
                  controller: 'SignupBillController',
                  data: { pageTitle: 'Billing Page' }
              });
      })

.controller('SignupBillController',
    function ($scope, $state, $cookieStore, apiService, $filter, $rootScope, $window) {
        $scope.breadcrumb = 2;
        // Init model
        $scope.Sub_Name = $cookieStore.get('Sub_Name');
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

        $rootScope.title = 'Dwellar./Bill';
         
        if ($cookieStore.get('Sub_Price') != "Free") {
            $scope.Sub_Price = parseFloat($cookieStore.get('Sub_Price')).toFixed(2);
            $scope.ServiceTax = (parseFloat($cookieStore.get('Sub_Price')) * parseFloat((12.36 / 100))).toFixed(2);
            $scope.TotalPrice = (parseFloat($scope.Sub_Price) + parseFloat($scope.ServiceTax)).toFixed(2);
            //$scope.ServiceTax = $filter('$scope.ServiceTax')(number, 2);
            //$scope.TotalPrice = $filter('$scope.TotalPrice')(number, 2);
        }
        else
        {
            $scope.Sub_Price = $cookieStore.get('Sub_Price');
            $scope.ServiceTax = "Free";
            $scope.TotalPrice = "Free";
        }
     
        $scope.params = {
            first_name: $cookieStore.get('First_Name'),
            last_name: $cookieStore.get('Last_Name'),
            account_email: $cookieStore.get('Account_Email'),
            account_phone: $cookieStore.get('Phone'),
            account_country: $cookieStore.get('Account_Country'),
            Password: $cookieStore.get('Hash'),
            OrgName: $cookieStore.get('OrgName'),
            who_am_i: $cookieStore.get('who_am_i')
         //   Organization_Id: ''

       };

        $scope.organization = {
            Id:'',
            street_1: $cookieStore.get('Street_1'),
            street_2: $cookieStore.get('Street_2'),
            street_3: $cookieStore.get('Street_3'),
            city: $cookieStore.get('City'),
            state: $cookieStore.get('State'),
            zip_code: $cookieStore.get('zip_code'),
            country:$cookieStore.get('Country')
        };
        $scope.subscription = {
            organization_id: '',
            Subscription_Name: $scope.Sub_Name
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

        $scope.chosePaymentMethod = function(type) {
            $scope.params.type = type;
        };

        $scope.$watch('params', function(newvalue) {
           console.log(newvalue);
        }, true);

        $scope.addBill = function (isValid) {
         //   alert('bill save');
            $scope.showValid = true;
            if (isValid) {
                //alert('userCreate');
                //alert('Org name :' + $scope.params.OrgName);
                new UserCreate($scope.params);
              
             
            }
        };
    }
);
