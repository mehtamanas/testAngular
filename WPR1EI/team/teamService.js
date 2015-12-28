/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('team')
    .service('teamService', ['$http', 'appConstants',
        function ($http, appConstants) {

            this.get = function(url){
              return $http.get(url);
            };

            this.getUsersInTeam = function (teamId) {
                return $http.get(appConstants.APIBaseURL + 'Team/GetUsersByTeam/' + teamId)
            };

            this.getOrgUsers = function (orgId) {
                return $http.get(appConstants.APIBaseURL + 'User/Get?orgId=' + orgId)
            };

            this.getEngagements = function(){
                return $http.get('');
            };
            // Add users
            this.addUsersToTeam = function (usersTobeAdded) {
                return $http.post(appConstants.APIBaseURL + 'Mapping/UserToTeam', usersTobeAdded);
            };

            // Remove users
            this.removeUsersFromTeam = function (usersTobeRemoved) {
                return $http({
                    method: 'DELETE', url: appConstants.APIBaseURL + 'Team/DeleteMultipleUserFromTeam',
                    data: usersTobeRemoved, headers: { 'Content-Type': 'application/json' }
                });
            };

            this.AuditCreate = function (param) {

                $http.post(appConstants.APIBaseURL + "AuditLog/Create", param).then(function (response) {
                    var loginSession = response.data;

                },
                function (error) {

                });


            };
        }]);