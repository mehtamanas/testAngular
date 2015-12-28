angular.module('report')
.controller('reportController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {


        GetUrl = "Event/GetByID?id=38a801a8-9c32-4b52-8433-00c059421218&lead_source_name=Sales_Centre";
        $rootScope.title = 'Dwellar/Reports';

        apiService.get(GetUrl).then(function (response) {
            $scope.cities = response.data;


        },
                    function (error) {
                        deferred.reject(error);
                        alert("not working");
                    });


        console.log('reportController');
    });

