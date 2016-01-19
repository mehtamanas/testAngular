/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('newuser')
    .service('newuserService', ['$http', 'apiService',
        function ($http, apiService) {

            this.get = function (url) {
                return $http.get(url);
            };


            this.getTeamsInUser = function (userId) {

                return $http.get(apiService.baseUrl + 'User/GetTeamByUser/' + userId)
            };

            this.getOrgTeams = function (orgId) {
                alert(orgId);

                return $http.get(apiService.baseUrl + 'Team/Get?orgID=' + orgId)
            };

            this.getProjectsInUser = function (userId) {


                return $http.get(apiService.baseUrl + 'User/GetProjectsByUser/' + userId)
            };

            this.getOrgProjects = function (orgId) {
               
                alert("orgId" + orgId);

                return $http.get(apiService.baseUrl + 'Project/Get?orgID=' + orgId)
            };

            this.getEngagements = function () {

                return $http.get('');
            };

            // Add users
            this.addProjectsInUser = function (projectsTobeAdded) {

                //alert(projectsTobeAdded.organization_id);
                //alert(projectsTobeAdded.user_id);
                //                
                //alert(projectsTobeAdded.project_id);
                //alert(projectsTobeAdded.mapping_id);

                return $http.post(apiService.baseUrl + 'Mapping/UserToProject', projectsTobeAdded);
            };

            // Remove users
            this.removeProjectsFromUser = function (projectsTobeRemoved) {
                return $http({
                    method: 'DELETE', url: apiService.baseUrl + 'User/DeleteMultipleUserFromProject',
                    data: projectsTobeRemoved, headers: { 'Content-Type': 'application/json' }
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