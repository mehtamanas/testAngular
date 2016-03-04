/**
 * Created by dwellarkaruna on 28/10/15.
 */
angular.module('newuser')
    .service('uploadService', ['$http', 'apiService', function ($http, apiService) {
        this.postDataAfterUpload = function (dataToPost) {
            return $http.post(apiService.baseUrl + 'MediaElement/Create', dataToPost)
        }
    }]);