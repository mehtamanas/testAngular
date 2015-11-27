/**
 * Created by dwellarkaruna on 28/10/15.
 */
angular.module('channel')
    .service('uploadService', ['$http', 'appConstants', function ($http, appConstants) {
        this.postDataAfterUpload = function (dataToPost) {
            alert("hi");
            return $http.post(appConstants.APIBaseURL + 'ChannelPartners/Create', dataToPost)
        }
    }]);