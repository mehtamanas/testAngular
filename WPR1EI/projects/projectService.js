/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('project')
    .service('projectService', ['$http', 'apiService',
        function ($http, apiService) {

            this.getOrgTeams = function (orgId) {
             //   alert(orgId);

                return $http.get(apiService.baseUrl + 'Team/Get/' + orgId)
            };
            //


            //**this apis called for add users in projects
            this.getOrgProjects = function (userID) {
               
              //  alert("userID" + userID);

              //  return $http.get(apiService.baseUrl + 'Project/Get/' + orgId)
                return $http.get(apiService.baseUrl + "user/Get/" + userID)
    
            };

            this.getProjectsInUser = function (userId) {
                return $http.get(apiService.baseUrl + 'Project/GetUsersInOrg/' + userId)
            };

            //**



            this.getUsersInTeam = function (teamId) {
                return $http.get(apiService.baseUrl + 'Project/GetProjectTeamList/' + teamId)
            };

            //this.getOrgProjects = function (userID) {

            //      alert("userID" + userID);

            //      return $http.get(apiService.baseUrl + 'Project/Get/' + orgId)
            //    return $http.get(apiService.baseUrl + "Project/GetUsersInOrg/" + userID)

            //};

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
                    method: 'DELETE', url: apiService.baseUrl + 'Mapping/DeleteMultipleUserFromProject',
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