/**
 * Created by User on 10/28/2015.
 */
var AddUserProjectController = function ($scope, $q, $cookieStore, projectService, projectData, $modal,$modalInstance, $rootScope) {
    //alert("ff");
    $scope.ProjectsInUser = undefined;
    $scope.orgProjects = undefined;
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    var currentlyLoggedInUserId = $cookieStore.get('userId');
    var selectedcustomer = $scope.seletedCustomerId;
    var loadProjects = function () {
        var userID = $cookieStore.get('userId');
        // Use $q.all to get both the result and then process the result
        var userPromise = projectService.getProjectsInUser(selectedcustomer);//this user all projects
        var orgPromise = projectService.getOrgProjects(orgID); // organisation all project
        //  alert(teamPromise);
        //alert(orgPromise);

        ///var userPromise = newuserService.getTeamsInUser(projectData.userId);//this user all projects
        //var orgPromise = newuserService.getOrgTeams(projectData.orgId); // organisation all project
        var promises = [userPromise, orgPromise];

        $q.all(promises).then(function (values) {
            $scope.ProjectsInUser = values[0].data; //this user  all  project
            $scope.orgProjects = values[1].data;; //organisation all project

            // Now, find out the users already in the team and mark them
            angular.forEach($scope.ProjectsInUser, function (existingUser) {    //this user all prokect loop
                var existingOrgProject = _.findWhere($scope.orgProjects, { id: existingUser.id }); //finding project id user belongs to in all project
                if (existingOrgProject) existingOrgProject.isUserMember = true;
            })
        });
    };

    loadProjects(); //loadig all org project

    var projectsTobeRemoved = [];
    var projectsTobeAdded = [];

    // Get the collection of users to be removed
    $scope.removeProject = function (Project) {
        if (Project.isUserMember) {
            Project.isUserMember = false;

            var existingProjects = _.pluck($scope.ProjectsInUser, 'id');

            // Do not add to remove list if the user is not already present in the server.
            if (existingProjects.indexOf(Project.id) > -1 && projectsTobeRemoved.indexOf(Project.id) == -1)
                projectsTobeRemoved.push(Project.id);

            // Remove the user if just added
            projectsTobeAdded = _.remove(projectsTobeAdded, function (removeMe) {
                return removeMe.project_id == project.id;
            });
        }
    };

    // Get the collection of Projects to be added
    $scope.addUser = function (project) {
        if (!project.isUserMember) {
            project.isUserMember = true;

            var existingProjects = _.pluck($scope.ProjectsInUser, 'id');

           // alert(project.id);

            // User should not be already existing and do not add duplicate entry
            if (existingProjects.indexOf(project.id) == -1 && projectsTobeAdded.indexOf(project.id) == -1) {
                {
                    // alert("In Add Code");
                    projectsTobeAdded.push(project.id);
                }
            }

            // Remove the Projects if just added
            projectsTobeRemoved = _.remove(projectsTobeRemoved, function (removeMe) {
                return removeMe.project_id == project.id;
            });
        }
    };

    // Final update to the server
    $scope.updateUserProjects = function () {

        // remove already existing user if they are removed and added again
        var projectsToAdd = projectsTobeAdded;

        // get only the existing users to be removed to avoid unnecessary calls
        var projectsToRemove = projectsTobeRemoved;

        // Clear the temp arrays for next time
        projectsTobeAdded = [];
        projectsTobeRemoved = [];

        var projectsToBeAddedOnServer = [];
        var projectsToBeRemovedOnServer = [];

        // Add the new users
        var updatePromisses = [];
        angular.forEach(projectsToAdd, function (projectId) {
            var newMember = {};
            newMember.mapping_id = projectId;
            newMember.project_id = selectedcustomer;
            newMember.user_id = currentlyLoggedInUserId;
            newMember.organization_id = projectData.orgId;
            newMember.isteam = 0;
            projectsToBeAddedOnServer.push(newMember)
        });

        // Remove the selected users
        var removePromisses = [];
        angular.forEach(projectsToRemove, function (projectId) {
            var existingMember = {};
            existingMember.mapping_id = projectId;
            existingMember.project_id = selectedcustomer;
            existingMember.user_id = currentlyLoggedInUserId;
            existingMember.organization_id = projectData.orgId;

            projectsToBeRemovedOnServer.push(existingMember)
        });

        if (projectsToBeAddedOnServer.length > 0)
            updatePromisses.push(projectService.addProjectsInUser(projectsToBeAddedOnServer));
        if (projectsToBeRemovedOnServer.length > 0)
            updatePromisses.push(projectService.removeProjectsFromUser(projectsToBeRemovedOnServer));

        $q.all(updatePromisses).then(function (results) {
            if (results.length > 0) {
                loadProjects();
              //  alert('User members updated successfully.')
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
                $rootScope.$broadcast('REFRESH', 'UserGrid');
            }
        }, function (errors) {
            alert('User members are failed to update.')
        });
    };

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'projects/AddSuccessful.html',
            backdrop: 'static',
            controller: AddController,
            size: 'md',
            resolve: { items: { title: "User" } }
        });

       
    };

};  