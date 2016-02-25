
angular.module('campaigns')

.controller ('EmailTagController', 
function ($scope, $state, $cookieStore, apiService, $rootScope, $window, $q, emailService) {
    console.log('EmailTagController');
    emailData= {
            teamId: window.sessionStorage.selectedCustomerID,
            orgId:$cookieStore.get('orgID')
    }
      
    $scope.usersInTeam = undefined;
    $scope.orgUsers = undefined;

    var currentlyLoggedInUserId = $cookieStore.get('userId');
    //alert(currentlyLoggedInUserId);
    var loadUsers = function () {

        // Use $q.all to get both the result and then process the result
        var teamPromise =emailService.getOrgUsers(emailData.orgId);
        var orgPromise = emailService.getUsersInTeam();
           
        //  alert(teamPromise);
        //alert(orgPromise);
        var promises = [teamPromise, orgPromise];

        $q.all(promises).then(function (values) {
            $scope.usersInTeam = values[0].data;
            $scope.orgUsers = _.filter(values[1].data );

            // Now, find out the users already in the team and mark them
            angular.forEach($scope.usersInTeam, function (existingUser) {
                var existingOrgUser = _.findWhere($scope.orgUsers, { user_id: existingUser.id });
                if (existingOrgUser) existingOrgUser.isTeamMember = true;
            })
        });
    };

    loadUsers();

     usersToBeRemoved = [];
     usersToBeAdded = [];

    // Get the collection of users to be removed
    $scope.removeUser = function (user) {
        if (user.isTeamMember) {
            user.isTeamMember = false;

            var existingUsers = _.pluck($scope.usersInTeam, 'id');

            // Do not add to remove list if the user is not already present in the server.
            if (existingUsers.indexOf(user.id) > -1 && usersToBeRemoved.indexOf(user.id) == -1)
                usersToBeRemoved.push(user.id);

            // Remove the user if just added
            usersToBeAdded = _.remove(usersToBeAdded, function (removeMe) {
                return removeMe.id == user.id;
            });
        }
    };

    // Get the collection of users to be added
    $scope.addUser = function (user) {
        if (!user.isTeamMember) {
            user.isTeamMember = true;

            var existingUsers = _.pluck($scope.usersInTeam, 'id');

            // User should not be already existing and do not add duplicate entry
            if (existingUsers.indexOf(user.id) == -1 && usersToBeAdded.indexOf(user.id) == -1) {
                {
                    usersToBeAdded.push(user.id);
                }
            }

            // Remove the user if just added
            usersToBeRemoved = _.remove(usersToBeRemoved, function (removeMe) {
                return removeMe.id == user.id;
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

        usersToBeAddedOnServer = [];
         usersToBeRemovedOnServer = [];

        // Add the new users
        var updatePromisses = [];
        angular.forEach(usersToAdd, function (userId) {
            var newMember = {};
            newMember.tag_id = userId;
            newMember.user_id = currentlyLoggedInUserId;
            newMember.campaign_id = "";
            newMember.organization_id = emailData.orgId;

            usersToBeAddedOnServer.push(newMember)
            

        });

        // Remove the selected users
        var removePromisses = [];
        angular.forEach(usersToRemove, function (userId) {
            var existingMember = {};
            existingMember.tag_id = userId;
            existingMember.user_id = currentlyLoggedInUserId;
            existingMember.campaign_id ="";
            existingMember.organization_id = emailData.orgId;

            usersToBeRemovedOnServer.push(existingMember)
          
        });

        //if (usersToBeAddedOnServer.length > 0)
        //    updatePromisses.push(emailService.addUsersToTeam(usersToBeAddedOnServer));
        //if (usersToBeRemovedOnServer.length > 0)
        //    updatePromisses.push(emailService.removeUsersFromTeam(usersToBeRemovedOnServer));

        //$q.all(updatePromisses).then(function (results) {
        //    if (results.length > 0) {
        //        loadUsers();
        //        alert('Team members updated successfully.')
        //        $modalInstance.dismiss();
        //    }
        //}, function (errors) {
        //    if (error.status === 400)
        //        alert(error.data.Message);
        //    else
        //        alert("Network issue");
        //});
    };

    $scope.next = function () {
        $scope.updateTeamUsers();
        $cookieStore.put('usersToBeAddedOnServer1', usersToBeAddedOnServer);
        $cookieStore.put('usersToBeRemovedOnServer1', usersToBeRemovedOnServer);
        $state.go('app.addTemplate');
    }
    $scope.cancel = function () {
        $state.go('app.option');
    }
});
