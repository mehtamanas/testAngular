angular.module('app.guest.login')

.directive("compareto", function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareto"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})




    .config(function config($stateProvider) {
        $stateProvider
            .state('signup_free_account', {
                url: '/signup-free-account?subscriptionType',
                controller: 'SignupFreeAccountController',
                templateUrl: 'login/signup_free_account.tpl.html',


                data: { pageTitle: 'Sign Up Free Account' }
            });
    })

    .controller('SignupFreeAccountController',
    function ($scope, $state, COUNTRIES, apiService, $cookieStore, $modal, $rootScope) {
        $scope.countryList = COUNTRIES;

        $scope.breadcrumb = 0;

        $rootScope.title = 'Dwellar./Signup_free_account';
     
       

        // Init model
        $scope.params = {
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            account_email: $scope.account_email,
            account_phone: $scope.account_phone,
            account_country: $scope.country,
            country: $scope.country,
            Password: $scope.Password,
            OrgName: $scope.OrgName
        };
        var emp = {
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            account_email: $scope.account_email,
            account_phone: $scope.account_phone,
            account_country: $scope.country,
            country: $scope.country,
            hash: $scope.Password,
            organization_id: '',
            OrganizationName: $scope.OrgName,
            subName: $scope.subName
        };

        $scope.params.first_name = $cookieStore.get('First_Name');
        $scope.params.last_name = $cookieStore.get('Last_Name');
        $scope.params.account_email = $cookieStore.get('Account_Email');
        $scope.params.account_phone = $cookieStore.get('Phone');               
        $scope.country1 = $cookieStore.get('Account_Country');
      



        $scope.confirms = {
            hash: $scope.hash
        };

        $scope.CheckUser = function () {
            Url = "User/GetEmailCheck?Email_id=" + $scope.params.account_email;

            apiService.get(Url).then(function (response) {
                data = response.data;
                $state.go("organization");
               
            },
           function (error) {
               alert("User Already Exists Choose Another Email-id");
               $state.go("signup_free_account");
              
           });
        };

       
        $scope.addPersonalInfo = function (isValid) {
            $scope.showValid = true;
            if (isValid) {

                $cookieStore.put('First_Name', $scope.params.first_name);
                $cookieStore.put('Last_Name', $scope.params.last_name);
                $cookieStore.put('Account_Email', $scope.params.account_email);
                $cookieStore.put('Phone', $scope.params.account_phone);
                $cookieStore.put('Account_Country', $scope.params.country);
                $cookieStore.put('Hash', $scope.params.Password);
                //$cookieStore.put('OrgName', $scope.params.OrgName);
               
                $scope.showValid = false;
                $scope.CheckUser();
               
            }

        };



        $scope.callparam = {
            Name: $scope.Name,
            Company: $scope.Company,
            Email: $scope.Email,
            Phone: $scope.Phone,

        };


        $scope.confirms = {
            hash: $scope.hash
        };

        $scope.call_back_info = function () {

            projectUrl = "callback/Create";
            ProjectCreate = function (callparam) {

                apiService.post(projectUrl, callparam).then(function (response) {
                    var loginSession = response.data;
                    alert("Thank You We Will Call Back to Soon.....!!");
                    $modalInstance.dismiss();
                },
           function (error) {
               alert("Error " + error.state);
           });
            };




        };



       


        $scope.openSalesPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'login/sales_enquiries.tpl.html',
                backdrop: 'static',
                controller: SalesPopUpController,

            });
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
           
        };
    }



)

