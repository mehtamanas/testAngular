
angular.module('contacts')
    .service('uploadService', ['$http', 'apiService', function ($http, appConstants) {
        this.postDataAfterUpload = function (dataToPost) {
            return $http.post(apiService.baseUrl + 'MediaElement/Create', dataToPost)
        }
    }]);