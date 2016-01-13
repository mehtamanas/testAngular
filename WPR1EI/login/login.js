angular.module('app.guest.login')

.controller('LoginController',
    function ($scope, $state, security, $modal, $http, $cookieStore, $rootScope, $modal, deviceDetector,$window) {
        // Init model
        $scope.params = {
            email: '',
            password: '',
            remember: false
        };

        $scope.error = '';
        $scope.success = '';

        $scope.rememberMe = function () {
            if ($scope.params.remember) {
                $window.localStorage.setItem($scope.params.email, JSON.stringify(data = { 'email': $scope.params.email, 'password': $scope.params.password }));
            }
        }

        $scope.$watch('params.email', function () {
            if ($window.localStorage.getItem($scope.params.email)!=undefined) {
                $scope.params.password= (JSON.parse($window.localStorage.getItem($scope.params.email))).password;
                $scope.params.remember = true;
            }
            $scope.error = '';
            $scope.success = '';
        });

        $rootScope.title = 'Dwellar./Login';




        // Login
        $scope.login = function (isValid) {
            $scope.isSubmitted = true;
            $scope.showValid = true;

            if (isValid) {
                security.login($scope.params.email, $scope.params.password).then(function (response) {
                    console.log(response);
                    $scope.success = 'Login successful!';
                    $scope.error = '';
                    $cookieStore.put('loggedUser', response.first_name);

                    if (!security.redirect()) {
                        if ($cookieStore.get('builderflow') == "yes") {
                            $state.go('channel_form');
                            return;
                        }

                        $state.go('app.project');
                    }

                },
                
                    $http.get('http://ipinfo.io/json').success(function (data) {
                        $scope.loginSession1 = data;

                        //alert('Login Session : ' + $scope.loginSession1.ip);
                        //alert('Location : ' + $scope.loginSession1.loc);
                        //alert('Country : ' + $scope.loginSession1.country);
                        //alert('platform : ' + navigator.platform);

                        var browser = '';
                        var browserVersion = 0;

                        if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                            browser = 'Opera';
                        } else if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                            browser = 'MSIE';
                        } else if (/Navigator[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                            browser = 'Netscape';
                        } else if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                            browser = 'Chrome';
                        } else if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                            browser = 'Safari';
                            /Version[\/\s](\d+\.\d+)/.test(navigator.userAgent);
                            browserVersion = new Number(RegExp.$1);
                        } else if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
                            browser = 'Firefox';
                        }
                        if (browserVersion === 0) {
                            browserVersion = parseFloat(new Number(RegExp.$1));
                        }

                        var vm = this;
                        vm.data = deviceDetector;
                        if (vm.data.device == "unknown") {
                            vm.data.device = "Desktop"
                        };

                        // alert(browser + " " + browserVersion);
                        $cookieStore.put('browser', browser);
                        $cookieStore.put('IP_Address', $scope.loginSession1.ip);
                        $cookieStore.put('LatLon', $scope.loginSession1.loc);
                        $cookieStore.put('Country', $scope.loginSession1.country);
                        $cookieStore.put('Platform', $scope.loginSession1.ip);
                        $cookieStore.put('Device', vm.data.device);
                        $cookieStore.put('Device_os', vm.data.os_version);

                        url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + $cookieStore.get('LatLon') + '&sensor=true',
                            $http.get(url).success(function (data) {
                                add = data.results[0].formatted_address;
                                $cookieStore.put('Location', add);
                            })
                    }),


                function (error) {
                    console.log(error);
                    $scope.success = '';
                    $scope.error = 'Invalid Email Address or Passowrd. Please try again.';
                });

            }
        };
        $scope.openSignupPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'login/signup_free_account.tpl.html',

                controller: SignupFreeAccountController,
                size: 'md'
            });
        };
    }
);
