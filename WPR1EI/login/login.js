angular.module('app.guest.login')

.controller('LoginController',
    function ($scope, $state, security, $modal, $http, $cookieStore, $rootScope, deviceDetector, $window, Idle, $cookies, $filter, apiService) {
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
                $cookieStore.put($scope.params.email, JSON.stringify(data = { 'email': $scope.params.email, 'password': $scope.params.password }));
            }
        }

        $scope.$watch('params.email', function () {
            if ($cookieStore.get($scope.params.email)!=undefined) {
                $scope.params.password= (JSON.parse($cookieStore.get($scope.params.email))).password;
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
                $scope.params.email = $filter('lowercase')($scope.params.email);
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
                        Idle.watch();
                        $state.go('app.property');
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
                        if (vm.data.device === "unknown")
                            $cookieStore.put('Device_os', vm.data.os);
                        else
                            $cookieStore.put('Device_os', vm.data.os_version);

                        url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + $cookieStore.get('LatLon') + '&sensor=true',
                            $http.get(url).success(function (data) {
                                add = data.results[0].formatted_address;
                                $cookieStore.put('Location', add);
                            })
                    }),


                function (error) {
                    if (error.status === 400)
                        alert(error.data.Message);
                    else
                        alert("Network issue");
                });

            }
        };


        // edited by surekha on 30-1-2016
        $scope.params =
                  {
                      operating_system: $cookieStore.get('Device_os'),
                      device_name: $cookieStore.get('Device'),
                      mac_id: "34:#$::43:434:34:45",
                      organization_id: $cookieStore.get('orgID'),
                      User_ID: $cookieStore.get('userId')
                  };

        DeviceCreate = function (param) {
            apiService.post("User/DeviceCreate", param).then(function (response) {
                var loginSession = response.data;
            },
           function (error) {

           });
        };
        DeviceCreate($scope.params);
        
        //end
       

        $scope.openSignupPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'login/signup_free_account.tpl.html',

                controller: SignupFreeAccountController,
                size: 'md'
            });
        };


        //session timeout start
        $scope.events = [];

        $rootScope.$on('IdleStart', function () {
            // the user appears to have gone idle
            console.log("IdleStart");
        });

        $rootScope.$on('IdleWarn', function (e, countdown) {
            // follows after the IdleStart event, but includes a countdown until the user is considered timed out
            // the countdown arg is the number of seconds remaining until then.
            // you can change the title or display a warning dialog from here.
            // you can let them resume their session by calling Idle.watch()
            console.log("IdleWarn");
        });

        $rootScope.$on('IdleTimeout', function () {
            // the user has timed out (meaning idleDuration + timeout has passed without any activity)
            // this is where you'd log them
            $cookieStore.remove('Country');
            $cookieStore.remove('Device');
            $cookieStore.remove('Device_os');
            $cookieStore.remove('IP_Address');
            $cookieStore.remove('LatLon');
            $cookieStore.remove('Location');
            $cookieStore.remove('Platform');
            $cookieStore.remove('authToken');
            $cookieStore.remove('browser');
            $cookieStore.remove('currentUser');
            $cookieStore.remove('loggedUser');
            $cookieStore.remove('orgID');
            $cookieStore.remove('userId');
            $cookieStore.remove('authToken');
            $cookieStore.remove('builderflow');
            $cookieStore.remove('builderflow');
            $cookieStore.remove('teamid');
            $cookieStore.remove('contactid');
            $cookieStore.remove('Selected Text');
            $cookieStore.remove('Organization_id');
            $cookieStore.remove('OrgName');
            $cookieStore.remove('Street_1');
            $cookieStore.remove('Street_2');
            $cookieStore.remove('Street_3');
            $cookieStore.remove('City');
            $cookieStore.remove('State');
            $cookieStore.remove('Zip_code');
            $cookieStore.remove('Country');
            $cookieStore.remove('who_am_i');
            $cookieStore.remove('First_Name');
            $cookieStore.remove('Last_Name');
            $cookieStore.remove('Account_Email');
            $cookieStore.remove('Phone');
            $cookieStore.remove('Account_Country');
            $cookieStore.remove('Hash');
            $cookieStore.remove('Subscription2_Name');
            $cookieStore.remove('Subscription2_Price');
            $cookieStore.remove('Subscription1_Name');
            $cookieStore.remove('Subscription1_Price');
            $cookieStore.remove('Subscription3_Name');
            $cookieStore.remove('Subscription3_Price');
            $cookieStore.remove('Subscription4_Name');
            $cookieStore.remove('Subscription4_Price');
            $cookieStore.remove('Sub_Name');
            $cookieStore.remove('Sub_Price');
            $cookieStore.remove('checkedIds');
            $cookieStore.remove('projectid');
            $cookieStore.remove('payment_schedule_id');
            $cookieStore.remove('FloorId');
            $cookieStore.remove('wing_id');
            $cookieStore.remove('tower_id');
            $cookieStore.remove('teamid');
            localStorage.clear();
            $modalInstance.dismiss();
            console.log("loggedout");
            $state.go('login');
        });

        $rootScope.$on('IdleEnd', function () {
            // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
            console.log("IdleEnd");
        });

        $rootScope.$on('Keepalive', function() {
            // do something to keep the user's session alive
            console.log("Keepalive");
        });


        //end
    }
)