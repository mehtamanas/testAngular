'use strict';

angular.module('property')
    .controller('PropertyLeadController', ['$scope', 'propertyService', function ($scope, propertyService) {

        var propertyId = 'e9c1a61c-a819-46f5-be24-6523d7944fab';

        var getPropertyLeads = function () {
            propertyService.getPropertyLeads(propertyId).then(function (leads) {
                $scope.leads = leads.data[0];

                // Build address if it is not of free from type
                $scope.leads = $scope.data.leads;
            })
        };
        //();
    }
    ]);
