/**
 * Created by dwellarkaruna on 28/10/15.
 */
angular.module('project')
    .service('uploadService', ['$http', 'appConstants', function ($http, appConstants) {
        this.postDataAfterUpload = function (dataToPost) {
            return $http.post(appConstants.APIBaseURL + 'Project/ProjectAddress', dataToPost)
           
        }
        


    }]);

