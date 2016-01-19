/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('team')
    .service('teamService', ['$http', 'apiService',
        function ($http, apiService) {

            this.get = function(url){
              return $http.get(url);
            };

            this.getUsersInTeam = function (teamId) {
                return $http.get(apiService.baseUrl + 'Team/GetUsersByTeam/' + teamId)
            };

            this.getOrgUsers = function (orgId) {
                return $http.get(apiService.baseUrl + 'User/Get/' + orgId)
            };

            this.getEngagements = function(){
                return $http.get('');
            };
            // Add users
            this.addUsersToTeam = function (usersTobeAdded) {
                return $http.post(apiService.baseUrl + 'Mapping/UserToTeam', usersTobeAdded);
            };

            // Remove users
            this.removeUsersFromTeam = function (usersTobeRemoved) {
                return $http({
                    method: 'DELETE', url: apiService.baseUrl + 'Team/DeleteMultipleUserFromTeam',
                    data: usersTobeRemoved, headers: { 'Content-Type': 'application/json' }
                });
            };

            this.AuditCreate = function (param) {

                $http.post(apiService.baseUrl + "AuditLog/Create", param).then(function (response) {
                    var loginSession = response.data;

                },
                function (error) {

                });


            };
        }]);