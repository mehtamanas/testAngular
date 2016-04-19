
angular.module('campaigns')

.controller ('EmailTagController', 
function ($scope, $state, $cookieStore, apiService, $rootScope, $window, $q, emailService) {
    console.log('EmailTagController');
    $scope.contactListFilter = '';
    
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
            $scope.orgUsers = _.filter(values[1].data);

            if ($cookieStore.get('usersToBeAddedOnServer1')) { //if user has clicked baqck from next page
                var a = ($cookieStore.get('usersToBeAddedOnServer1'))[0].people_list_id;
                var userObject = (_.findWhere($scope.orgUsers, { id: a }))
                $scope.addUser(userObject);
            }

            // Now, find out the users already in the team and mark them
            angular.forEach($scope.usersInTeam, function (existingUser) {
                var existingOrgUser = _.findWhere($scope.orgUsers, { user_id: existingUser.id });
                if (existingOrgUser) existingOrgUser.isTeamMember = true;
            })
        });
    };

    loadUsers();
    if ($cookieStore.get('usersToBeAddedOnServer1')) {
        var a = ($cookieStore.get('usersToBeAddedOnServer1')).people_list_id;
        $scope.orgUsers
    }
     usersToBeRemoved = [];
     usersToBeAdded = [];

     $scope.addRemoveUser = function (user) {
         //alert("hi");
         if (usersToBeAdded.length < 1 && !user.isTeamMember) {
             $scope.addUser(user);
         }
         else if (user.isTeamMember) {
             $scope.removeUser(user);
         }
     };
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
        if (usersToBeAdded.length < 1 && !user.isTeamMember)
        {
            user.isTeamMember = true;
            var existingUsers = _.pluck($scope.usersInTeam, 'id');

        
            
            // User should not be already existing and do not add duplicate entry
            
            if (existingUsers.indexOf(user.id) == -1 && usersToBeAdded.indexOf(user.id) == -1)
            {
                        usersToBeAdded.push(user.id);
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
            newMember.people_list_id = userId;
            newMember.user_id = currentlyLoggedInUserId;
            newMember.campaign_id = "";
            newMember.organization_id = emailData.orgId;

            usersToBeAddedOnServer.push(newMember)
            

        });

        // Remove the selected users
        var removePromisses = [];
        angular.forEach(usersToRemove, function (userId) {
            var existingMember = {};
            existingMember.people_list_id = userId;
            existingMember.user_id = currentlyLoggedInUserId;
            existingMember.campaign_id ="";
            existingMember.organization_id = emailData.orgId;

            usersToBeRemovedOnServer.push(existingMember)
          
        });

      
    };

    $scope.next = function () {
        if (usersToBeAdded.length < 1) {
            alert("Please select a contact list");
            return;
        }
        $scope.updateTeamUsers();
        Url = "PeopleList/GetPeopleListByPeopleId/" + usersToBeAddedOnServer[0].people_list_id;

        apiService.get(Url).then(function (response) {
            $scope.data1 = response.data;
            $scope.contactCount = 0;
            $scope.totalcontactCount = 0;
            for (i = 0; i < $scope.data1.length; i++)
            {
                $scope.totalcontactCount = $scope.totalcontactCount + 1;
                if ($scope.data1[i].email == null || $scope.data1[i].email == '')
                {
                    $scope.contactCount = $scope.contactCount + 1;
                }
            }
           
                
            sweetAlert("", "Number of people with invalid email Id: " + $scope.contactCount + "     and Total number of people:" + $scope.totalcontactCount);
            
            $cookieStore.put("totalPersonCount", $scope.totalcontactCount);
        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });
        $cookieStore.put('usersToBeAddedOnServer1', usersToBeAddedOnServer);
        $cookieStore.put('usersToBeRemovedOnServer1', usersToBeRemovedOnServer);
        $state.go('app.addTemplate');
    }
    

    $scope.cancel = function () {

        $cookieStore.remove('usersToBeAddedOnServer1');
        $state.go('app.campaignsEmail');
    };

    $scope.back = function ()
    {      
          
        $state.go('app.budgetEmail');
    }
});
