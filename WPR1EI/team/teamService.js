/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('team')
    .service('teamService', ['$http', 'apiService',
        function ($http, apiService) {

            this.get = function(url){
              return $http.get(url);
            };

            this.getTeamsInUser = function (userId) {

                return $http.get(apiService.baseUrl + 'User/GetTeamByUser/' + userId)
            };

            this.getOrgTeams = function (orgId) {
                //   alert(orgId);

                return $http.get(apiService.baseUrl + 'Team/Get?orgID=' + orgId)
            };

            this.getProjectsInUser = function (userId) {


                return $http.get(apiService.baseUrl + 'User/GetProjectsByUser/' + userId)
            };

            this.getOrgProjects = function (userID) {

                //  alert("userID" + userID);

                //  return $http.get(apiService.baseUrl + 'Project/Get/' + orgId)
                return $http.get(apiService.baseUrl + "Organization/GetProjectDetails?id=" + userID)

            };

            this.getEngagements = function () {

                return $http.get('');
            };

            // Add users
            this.addProjectsInUser = function (projectsTobeAdded) {
               
                return $http.post(apiService.baseUrl + 'Mapping/UserToProject', projectsTobeAdded);
            };

            // Remove users
            this.removeProjectsFromUser = function (projectsTobeRemoved) {
                return $http({
                    method: 'DELETE', url: apiService.baseUrl + 'User/DeleteMultipleUserFromProject',
                    data: projectsTobeRemoved, headers: { 'Content-Type': 'application/json' }
                });
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