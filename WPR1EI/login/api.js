angular.module('services.api', ['restangular'])

.factory('apiService',
    function(Restangular, $cookieStore, $rootScope, CONFIGS) {
        var baseUrl = CONFIGS.baseURL();

        // Global configuration for Restangular API connection.
        Restangular.setBaseUrl(baseUrl);
        Restangular.setFullResponse(false);
        Restangular.setDefaultHeaders({'X-ZUMO-APPLICATION': 'wOoVLFttYdxtzrtAWXMctSGaUQqJqf32'});
        Restangular.setDefaultHttpFields({withCredentials: false, cache: true, timeout: 60000}); // 60 second

        Restangular.addResponseInterceptor(function (response, operation, what, url) {    //inventory loader
            $rootScope.$broadcast('API:loading:ended');
            if (what.indexOf("Floors/GenerateTowerGrid") != -1) {
                $rootScope.$broadcast('inventoryLoaded', 0);
            }
            var responseArr = [];
            responseArr['data'] = response;

            return responseArr;
        });


       


        Restangular.addRequestInterceptor(function (element, operation, what, url) {
            // Not cache
            //if(operation === 'get') {
            //    Restangular.setDefaultRequestParams({ver: Math.random()});
            //} else {
            //    Restangular.setDefaultRequestParams({ver: undefined});
            //}

            var data = {
                element: element,
                operation: operation,
                what: what,
                url: url
            };

            if (what.indexOf("Floors/GenerateTowerGrid") != -1) {
                $rootScope.$broadcast('inventoryLoading', 1);
            }

            if (what.indexOf('loadingSpinnerNotShowing') === -1) {
                $rootScope.$broadcast('API:loading:started', data);
            }
        });




        Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
            $rootScope.$broadcast('API:loading:ended');

            console.log("Response received with HTTP error code: " + response.status);

            return true; // error not handled
        });

        var service = {
            ipTraceUrl: CONFIGS.ipTraceUrl(),
            baseUrl: CONFIGS.baseURL(),
            uploadURL: CONFIGS.uploadURL(),
            authToken: '',
            all: function(resource, queryParams) {
                if(queryParams === undefined) {
                    return Restangular.all(resource).getList();
                } else {
                    return Restangular.all(resource).getList(queryParams);
                }
            },

            find: function(resource, id) {
                return Restangular.one(resource, id).get();
            },

            post: function(resource, subElement, elementToPost, queryParams, headers) {
                if(queryParams === undefined) {
                    headers = elementToPost;
                    elementToPost = subElement;
                    return Restangular.all(resource).post(elementToPost, headers);
                } else {
                    return Restangular.one(resource).post(subElement, elementToPost, queryParams, headers);
                }
            },

            postFormData: function(resource, formData) {
                return Restangular.all(resource)
                    .withHttpConfig({transformRequest: angular.identity})
                    .post(formData);
            },

            upload: function(resource, formData) {
                return Restangular.all(resource)
                    .withHttpConfig({transformRequest: angular.identity, timeout: 100000}) // 100 second
                    .post(formData, undefined, {'Content-Type': undefined});
            },

            download: function(resource, subElement, queryParams) {
                if(queryParams === undefined) {
                    queryParams = subElement;
                    return Restangular
                        .withConfig(function(Config) {
                            Config.setFullResponse(true);
                        })
                        .one(resource)
                        .withHttpConfig({responseType: 'arraybuffer'})
                        .get(queryParams);
                } else {
                    return Restangular
                        .withConfig(function(Config) {
                            Config.setFullResponse(true);
                        })
                        .all(resource)
                        .withHttpConfig({responseType: 'arraybuffer'})
                        .customGET(subElement, queryParams);
                }
            },

            get: function(resource, queryParams, headers, subElement) {
                if(subElement) {
                    return Restangular.all(resource).customGET(subElement, queryParams, headers);
                } else {
                    return Restangular.one(resource).get(queryParams, headers);
                }
            },
            getWithoutCaching: function (resource, queryParams, headers, subElement) {
                if (subElement) {
                    return Restangular.all(resource)
                    .withHttpConfig({ cache: false })
                    .customGET(subElement, queryParams, headers);
                } else {
                    return Restangular.one(resource)
                    .withHttpConfig({ cache: false })
                    .get(queryParams, headers);
                }
            },
            put: function(resource, elementToPost, subElement, queryParams, headers) {
                return Restangular.one(resource).customPUT(elementToPost, subElement, queryParams, headers);
            },

            putFormData: function(resource, formData) {
                return Restangular.all(resource)
                    .withHttpConfig({transformRequest: angular.identity})
                    .customPUT(formData);
            },

            patch: function(resource, object, queryParams, headers) {
                return Restangular.one(resource).patch(object, queryParams, headers);
            },

            remove: function(resource, subElement, queryParams, headers) {
                return Restangular.one(resource, subElement).remove(queryParams, headers);
            },

            setAuthTokenHeader: function(authToken) {
                service.authToken = authToken;
                //Restangular.setDefaultHeaders({Authorization: 'Token ' + authToken});
            },

            getUrl: function(resource) {
                return baseUrl + '/' + resource + '?api_key=' + encodeURIComponent(service.authToken) + '&ver=' + Math.random();
            }
        };

        return service;
    }




);
