/**
 * Created by dwellarkaruna on 28/10/15.
 */
angular.module('channel')
    .service('uploadService', ['$http', 'apiService', function ($http, apiService) {
        this.postDataAfterUpload = function (dataToPost) {
            alert("hi");
            return $http.post(apiService.baseUrl + 'ChannelPartners/Create', dataToPost)
        }
    }]);