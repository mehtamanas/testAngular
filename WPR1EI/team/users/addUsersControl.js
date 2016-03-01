
var AddUsersController = function ($scope, $q, $cookieStore, teamService, $modal, teamData, $rootScope, $modalInstance, apiService) {
   
    $scope.usersInTeam = undefined;
    $scope.orgUsers = undefined;

    var currentlyLoggedInUserId = $cookieStore.get('userId');

    //Audit log start               

   
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
          // device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details: "AddNewUser",
           application: "angular",
           browser: $cookieStore.get('browser'),
           ip_address: $cookieStore.get('IP_Address'),
           location: $cookieStore.get('Location'),
           organization_id: $cookieStore.get('orgID'),
           User_ID: $cookieStore.get('userId')
       };


        apiService.post("AuditLog/Create", postdata).then(function (response) {
            var loginSession = response.data;
        },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });
    };

    AuditCreate();
    //end
    
    var loadUsers = function () {

        // Use $q.all to get both the result and then process the result
        var teamPromise = teamService.getUsersInTeam(teamData.teamId);
        var orgPromise = teamService.getOrgUsers(teamData.orgId);
      
        var promises = [teamPromise, orgPromise];

        $q.all(promises).then(function (values) {
            $scope.usersInTeam = values[0].data;
            $scope.orgUsers = _.filter(values[1].data, { status: 'Active' });

            // Now, find out the users already in the team and mark them
            angular.forEach($scope.usersInTeam, function (existingUser) {
                var existingOrgUser = _.findWhere($scope.orgUsers, { user_id: existingUser.user_id });
                if (existingOrgUser) existingOrgUser.isTeamMember = true;
            })
        });
    };

    loadUsers();

    var usersToBeRemoved = [];
    var usersToBeAdded = [];

    // Get the collection of users to be removed
    $scope.removeUser = function (user) {
        if (user.isTeamMember) {
            user.isTeamMember = false;

            var existingUsers = _.pluck($scope.usersInTeam, 'user_id');

            // Do not add to remove list if the user is not already present in the server.
            if (existingUsers.indexOf(user.user_id) > -1 && usersToBeRemoved.indexOf(user.user_id) == -1)
                usersToBeRemoved.push(user.user_id);

            // Remove the user if just added
            usersToBeAdded = _.remove(usersToBeAdded, function (removeMe) {
                return removeMe.user_id == user.user_id;
            });
        }
    };

    // Get the collection of users to be added
    $scope.addUser = function (user) {
        if (!user.isTeamMember) {
            user.isTeamMember = true;

            var existingUsers = _.pluck($scope.usersInTeam, 'user_id');

            // User should not be already existing and do not add duplicate entry
            if (existingUsers.indexOf(user.user_id) == -1 && usersToBeAdded.indexOf(user.user_id) == -1) {
                {
                    usersToBeAdded.push(user.user_id);
                }
            }

            // Remove the user if just added
            usersToBeRemoved = _.remove(usersToBeRemoved, function (removeMe) {
                return removeMe.user_id == user.user_id;
            });
        }
    };

    // Final update to the server
    $scope.updateTeamUsers = function () {

        // remove already existing user if they are removed and added again
        var usersToAdd = usersToBeAdded;

        // get only the existing users to be removed to avoid unnecessary calls
        var usersToRemove = usersToBeRemoved;

        // Clear the temp arrays for next time
        usersToBeAdded = [];
        usersToBeRemoved = [];

        var usersToBeAddedOnServer = [];
        var usersToBeRemovedOnServer = [];

        // Add the new users
        var updatePromisses = [];
        angular.forEach(usersToAdd, function (userId) {
            var newMember = {};
            newMember.team_user_id = userId;
            newMember.user_id = currentlyLoggedInUserId;
            newMember.team_id = teamData.teamId;
            newMember.organization_id = teamData.orgId;

            usersToBeAddedOnServer.push(newMember)
        });

        // Remove the selected users
        var removePromisses = [];
        angular.forEach(usersToRemove, function (userId) {
            var existingMember = {};
            existingMember.team_user_id = userId;
            existingMember.user_id = currentlyLoggedInUserId;
            existingMember.team_id = teamData.teamId;
            existingMember.organization_id = teamData.orgId;

            usersToBeRemovedOnServer.push(existingMember)
        });

        if (usersToBeAddedOnServer.length > 0)
            updatePromisses.push(teamService.addUsersToTeam(usersToBeAddedOnServer));
        if (usersToBeRemovedOnServer.length > 0)
            updatePromisses.push(teamService.removeUsersFromTeam(usersToBeRemovedOnServer));

        $q.all(updatePromisses).then(function (results) {
            if (results.length > 0) {
                loadUsers();
               // alert('Team members updated successfully.')
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
            }
        }, function (errors) {
            //alert('Team members are failed to update.')
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

        $rootScope.$broadcast('REFRESH', 'UserGrid');
    };

};