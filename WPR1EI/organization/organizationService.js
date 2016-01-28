/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('organization')
    .service('organizationService', ['$http','apiService',
function ($http,apiService) {

            this.get = function(url){
              return $http.get(url);
            };

            this.getEngagements = function(){
                return $http.get('');
            };

            this.AuditCreate = function (param) {

                $http.post(apiService.baseUrl + "AuditLog/Create", param).then(function (response) {
                    var loginSession = response.data;

                },
                function (error)
                {
                    if (error.status === 400)
                        alert(error.data.Message);
                    else
                        alert("Network issue");
                });
            };

        }]);