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
                url: '/signup-free-account',
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
            account_country: $scope.countryList[0].name,
            Password: $scope.Password,
            OrgName: $scope.OrgName
        };
        var emp = {
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            account_email: $scope.account_email,
            account_phone: $scope.account_phone,
            account_country: $scope.countryList[0].name,
            hash: $scope.Password,
            organization_id: '',
            OrganizationName: $scope.OrgName,
            subName: $scope.subName
        };



        $scope.confirms = {
            hash: $scope.hash
        };






        $scope.openSalesPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'login/sales_enquiries.tpl.html',
                backdrop: 'static',
                controller: SalesPopUpController,

            });
        };
        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {


                new ProjectCreate($scope.params).then(function (response) {
                    console.log(response);
                    $scope.showValid = false;
                    $state.go('guest.signup.thanks');
                }, function (error) {
                    console.log(error);
                });

                $scope.showValid = false;

            }

        }


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
           // alert("submit successfully");
            new ProjectCreate($scope.callparam).then(function (response) {
                console.log(response);
                $scope.showValid = false;
                $state.go('guest.signup.thanks');
            }, function (error) {
                console.log(error);
            });



        };

        projectUrl = "callback/Create";
        ProjectCreate = function (callparam) {
            // alert(param.name);
            apiService.post(projectUrl, callparam).then(function (response) {
                var loginSession = response.data;
                alert("Thank You We Will Call Back to Soon.....!!");
                $modalInstance.dismiss();
            },
       function (error) {
           alert("Error " + error.state);
       });
        };

       

        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {


                new ProjectCreate($scope.callparam).then(function (response) {
                    console.log(response);
                    $scope.showValid = false;
                    $state.go('guest.signup.thanks');
                }, function (error) {
                    console.log(error);
                });

                $scope.showValid = false;

            }

        }


        //UserCreate = function (param) {
        //    var newbuilder = "";
        //    if ($scope.radioValue == 1) {
        //        newbuilder = 'Register/UserWithOrg';
        //        apiService.post(newbuilder, param).then(function (response) {
        //                var loginSession = response.data;
        //                alert(" Builder Email has been sent for Approval..!!");
        //                opensubscription();
        //            },
        //            function (error) {.

        //                alert("Error" + error.state);
        //            });
        //    }
        //    else {
        //        newbuilder = 'Register/User';
        //        apiService.get('organization/GetByName?orgName=' + param.OrganizationName).then(function (response) {
        //                $scope.data = response.data;
        //                angular.forEach($scope.data, function (value, key) {
        //                    param.organization_id = value.organization_id;
        //                    apiService.post(newbuilder, param).then(function (response) {
        //                            var loginSession = response.data;
        //                            alert(" broker Email has been sent for Approval..!!");
        //                            opensubscription();
        //                        },

        //                        function (error) {
        //                            // deferred.reject(error);
        //                            //return deferred.promise;
        //                            alert("Error" + error.state);
        //                        });
        //                });
        //            },
        //            function (error) {
        //                deferred.reject(error);
        //                alert("not working");
        //            });
        //    }

        //};

        $scope.addPersonalInfo = function (isValid)
        {
            $scope.showValid = true;
            if (isValid)
            {

                $cookieStore.put('First_Name', $scope.params.first_name);
                $cookieStore.put('Last_Name', $scope.params.last_name);
                $cookieStore.put('Account_Email', $scope.params.account_email);
                $cookieStore.put('Phone', $scope.params.account_phone);
                $cookieStore.put('Account_Country', $scope.params.account_country);
                $cookieStore.put('Hash', $scope.params.Password);
                $state.go('organization');
                $scope.showValid = false;
              }
           
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
    }
)

