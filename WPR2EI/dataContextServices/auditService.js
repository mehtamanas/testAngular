angular.module('services.api')
    .service('auditService', ['apiService', function (apiService) {
        var service = {};

        service.saveAuditLog = function (params) {
            return apiService.post('AuditLog/Create',params);
        }

        return service;
    }
    ]);