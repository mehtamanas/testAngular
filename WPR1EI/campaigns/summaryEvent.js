angular.module('campaigns')

     
.controller('summaryEventController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {

        var userId = $cookieStore.get('userId');
        $scope.params = {};

 
        $scope.params = {
            name:  $cookieStore.get('Name'),
            end_date: $cookieStore.get('End_Date'),
            Street_1: $cookieStore.get('Address'),
            start_date1: $cookieStore.get('Start_Date'),
            budget: $cookieStore.get('Budget'),
            no_of_leads: $cookieStore.get('No_of_leads'),
            sales: $cookieStore.get('Sales'),
            channel_type_id: $rootScope.selectedEvent,
            campaign_ID: $cookieStore.get('campaign_id'),
             organization_id: $cookieStore.get('orgID'),
             user_id: $cookieStore.get('userId'),
             tag_id:$cookieStore.get('usersToBeAddedOnServer1'),
		project_id: $cookieStore.get('project_id')
        }


        projectUrl = "CampaignEvent/Create";
        ProjectCreate = function (param) {         
            apiService.post(projectUrl, param).then(function (response) {
                var loginSession = response.data;             
                $scope.openSucessfullPopup();
                $state.go('app.campaigns');
                $rootScope.$broadcast('REFRESH', 'projectGrid');
                for (var i in usersToBeAddedOnServer) {
                    
                    usersToBeAddedOnServer.campaign_id=loginSession.id;
                    }
                for (var i in usersToBeRemovedOnServer) {
                    
                    usersToBeRemovedOnServer.campaign_id = loginSession.id;
                    }
                if (usersToBeAddedOnServer.length > 0)
                    updatePromisses.push(emailService.addUsersToTeam(usersToBeAddedOnServer));
                if (usersToBeRemovedOnServer.length > 0)
                    updatePromisses.push(emailService.removeUsersFromTeam(usersToBeRemovedOnServer));

            },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        })
        };

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'md',
                resolve: { items: { title: "campaigns" } }
            });
        }


        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {
                ProjectCreate($scope.params);
                $scope.showValid = false;

            }

        }
      
        $cookieStore.remove('Name');
        $cookieStore.remove('End_Date');
        $cookieStore.remove('Address');
        $cookieStore.remove('Start_Date');
        $cookieStore.remove('Budget');
        $cookieStore.remove('No_of_leads');
        $cookieStore.remove('Sales');
        $cookieStore.remove('channel_type_id');
        $cookieStore.remove('campaign_ID');

    });
