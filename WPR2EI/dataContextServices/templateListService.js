angular.module('services.api')
    .service('templateListService', ['apiService', function (apiService) {
        var service = {};

        service.getAllTemplates = function (orgID) {
            return apiService.getWithoutCaching('Template/GetAllTemplates?orgId=' + orgID);
        }

        return service;
    }
    ]);