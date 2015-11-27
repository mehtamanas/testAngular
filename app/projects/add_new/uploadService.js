/**
 * Created by dwellarkaruna on 28/10/15.
 */
angular.module('project')
    .service('uploadService', ['$http', 'appConstants', function ($http, appConstants) {
        this.postDataAfterUpload = function (dataToPost) {
            return $http.post(appConstants.APIBaseURL + 'Tower/CreateTower', dataToPost)
           
        }
        this.postDataAfterUpload = function (dataToPost) {
            return $http.post(appConstants.APIBaseURL + 'FloorType/FloorCreate', dataToPost)

        }
        this.postDataAfterUpload = function (dataToPost) {
            return $http.post(appConstants.APIBaseURL + 'UnitTypes/CreateNewUnitType', dataToPost)

        }



    }]);

