angular.module('security', [
    'security.retryQueue',
    'security.interceptor',
    'security.authorization'
])

.factory('security', function($rootScope, $cookieStore, $stateParams, $q, $location, securityRetryQueue, apiService,$modal) {
    // Redirect to the given url (defaults to '/')
    function redirect(url) {
        if(url !== '/guest/login') {
            service.path = '';
        }
        url = url || '/';
        $location.path(url);
    }

    // Register handler for when an item is added to the retry queue
    securityRetryQueue.onItemAddedCallbacks.push(function(retryItem) {
        //console.log(retryItem);
        if(securityRetryQueue.hasMore()) {
            service.path = $location.$$path;
            redirect('/guest/login');
        }
    });

    // The public API of the service
    var service = {
        // Path callback
        path: '',

        // Holds the object of the current logged in user
        currentUser:  undefined,

        // Get the first reason for needing a login
        getLoginReason: function() {
            return securityRetryQueue.retryReason();
        },

        // Give up trying to login and clear the retry queue
        cancelLogin: function() {
            redirect();
        },

        // Redirect callback
        redirect: function() {
            if(service.path) {
                redirect(service.path);
                return true;
            }
            return false;
        },

        // Attempt to authenticate a user by the given username and password
        login: function(account_email, password) {
            var deferred = $q.defer();            
            var params = {
                email_address: account_email,
                password: password
            };

            apiService.post('Authorization/Login', params).then(function (response) {
                var loginSession = response.data;
                //alert('Login Session : ' + loginSession.user_id);
                var userId = loginSession.user_id;
                var authToken = loginSession.login_token;
                var orgID = loginSession.organization_id;
                apiService.get('User/Get?id=' + userId).then(function (response) {
                    var currentUser = response.data;
                    if (currentUser) {
                        //alert('User First Name: ' + currentUser.first_name);

                        $cookieStore.put('currentUser', currentUser);
                        $cookieStore.put('authToken', authToken);
                        apiService.setAuthTokenHeader(authToken);
                        $cookieStore.put('orgID', orgID);
                        $cookieStore.put('userId', userId);
                        service.currentUser = currentUser;
                        deferred.resolve(service.currentUser);
                        //service.isAuthorized();
                    }
                    else {
                        
                        deferred.reject(false);
                    }
                },
                function (error) {
                    
                    deferred.reject(error);
                });
            },
            function (error) {

                if (error.status === 400)
                {
                    $rootScope.$broadcast('spinnerStop', 0);
                    var modalInstance = $modal.open({

                        animation: true,
                        templateUrl: 'login/error.tpl.html',
                        backdrop: 'static',
                        controller: ErrorsucessfullController,
                        size: 'md',
                        resolve: { items: { title: error.data.Message } }
                    });

                }
                    //alert(error.data.Message);
                else
                    alert("Network issue");
                deferred.reject(error);
                return deferred.promise;
            });

            return deferred.promise;
        },

        // Logout the current user and redirect
        logout: function(redirectTo) {
            if(arguments.length === 0) {
                 redirectTo = '/guest/login';
            }

            // Remove authToken and currentUser cookie
            $cookieStore.remove('currentUser');
            //$cookieStore.remove('authToken');

            // Reset current user object
            service.currentUser = null;

            // Set the Request Header 'Authorization'
            apiService.setAuthTokenHeader(null);

            // Redirect to supplied route
            redirect(redirectTo);
        },

        organization: function (name) {
    
            alert("NAME"+name);
            var params = {
                name: name                
            };

            apiService.post('Organization/Create', params).then(function (response) {
                var loginSession = response.data;
                //alert('Login Session : ' + loginSession.user_id);
                
                
              
                apiService.get('User/Get?id=' + userId).then(function (response) {
                    var currentUser = response.data;
                    if (currentUser) {
                        //alert('User First Name: ' + currentUser.first_name);

                        $cookieStore.put('currentUser', currentUser);
                        $cookieStore.put('authToken', authToken);
                        apiService.setAuthTokenHeader(authToken);
                        $cookieStore.put('orgID', orgID);
                        $cookieStore.put('userId', userId);
                        service.currentUser = currentUser;
                        deferred.resolve(service.currentUser);
                       
                    }
                    else {

                        deferred.reject(false);
                    }
                },
                function (error) {
                    deferred.reject(error);
                });
            },

            function (error) {
                deferred.reject(error);
                return deferred.promise;
            });

            return deferred.promise;
        },
        // Ask the backend to see if a user is already authenticated - this may be from a previous session.
        requestCurrentUser: function() {
            var deferred = $q.defer(),
                currentUser = $cookieStore.get('currentUser');
            if(currentUser) {
                service.currentUser = currentUser;
                deferred.resolve(service.currentUser);
            } else {
                deferred.resolve(false);
            }

            return deferred.promise;
        },

        // Is the current user authenticated?
        isAuthenticated: function() {
            return !!service.currentUser;
        },
        isAuthorized: function () {
            var deferred = $q.defer();
            apiService.get('Permission/GetRolePermissionById?id=' + $cookieStore.get('userId')).then(function (response) {
                service.currentPermission = response.data;
                 service.permissions = [];
                for (var i in service.currentPermission) {
                    //var per = {};
                    var newpermission = {};
                    newpermission.resource = service.currentPermission[i].resource_feature;
                    newpermission.read = service.currentPermission[i].read;
                    newpermission.write = service.currentPermission[i].write;
                    newpermission.delete = service.currentPermission[i].delete;
                    service.permissions.push(newpermission);
                }
                deferred.resolve(service.permissions);
            },
            function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

    };

    return service;

});
