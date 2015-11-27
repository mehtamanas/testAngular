/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('subscription_list')
    .service('subscription_listService', ['$http',
        function ($http) {

            this.get = function(url){
              return $http.get(url);
            };

            this.getEngagements = function(){
                return $http.get('');
            };

            this.AuditCreate = function (param) {

                $http.post(appConstants.APIBaseURL + "AuditLog/Create", param).then(function (response) {
                    var loginSession = response.data;

                },
                function (error) {

                });
            };

        }]);