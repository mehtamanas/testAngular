/**
 * Created by dwellarkaruna on 28/10/15.
 */
angular.module('project')
    .service('uploadService', ['$http', 'apiService', function ($http, apiService) {
        this.postDataAfterUpload = function (dataToPost) {
            return $http.post(apiService.baseUrl + 'Tower/CreateTower', dataToPost)
           
        }
        this.postDataAfterUpload = function (dataToPost) {
            return $http.post(apiService.baseUrl + 'FloorType/FloorCreate', dataToPost)

        }
        this.postDataAfterUpload = function (dataToPost) {
            return $http.post(apiService.baseUrl + 'UnitTypes/CreateNewUnitType', dataToPost)

        }



    }]);

