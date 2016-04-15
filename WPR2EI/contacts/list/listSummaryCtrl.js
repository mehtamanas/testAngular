angular.module('contacts')
.controller('listSummaryCtrl',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, $q, listService) {
        console.log('listSummaryCtrl');

        var userId = $cookieStore.get('userId');
        var tagToBeAdded = $cookieStore.get('tagsToBeAdded');
        var tagToBeRemove = $cookieStore.get('tagsToBeRemove');
        var contactListToBeAdded = $cookieStore.get('ContacListToBeAdded');
        var contactListToBeRemove = $cookieStore.get('ContacListToBeRemove');
        $scope.params = {};
        //Audit log start               
        AuditCreate = function () {
            var postdata =
           {
               device_os: $cookieStore.get('Device_os'),
               device_type: $cookieStore.get('Device'),
               //device_mac_id: "34:#$::43:434:34:45",
               module_id: "Contact",
               action_id: "Contact View",
               details: "Summary Email Campaign",
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

        $scope.params = {
            name: $cookieStore.get('Name'),
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId'),
            description: $cookieStore.get('Description'),
        }


        projectUrl = "PeopleList/CreatePeopleList";
        ProjectCreate = function (param) {
            apiService.post(projectUrl, param).then(function (response) {
                var loginSession = response.data;

                var updatePromisses = [];
                //tagAdded
                for (var i in tagToBeAdded) {

                    tagToBeAdded[i].people_list_id = loginSession.id;
                }
                for (var i in tagToBeRemove) {

                    tagToBeRemove[i].people_list_id = loginSession.id;
                }
                if (tagToBeAdded.length > 0)
                    updatePromisses.push(listService.addUsersToTeam(tagToBeAdded));
                if (tagToBeRemove.length > 0)
                    updatePromisses.push(listService.removeUsersFromTeam(tagToBeRemove));


                //ContactList Added
                for (var i in contactListToBeAdded) {

                    contactListToBeAdded[i].people_list_id = loginSession.id;
                }
                for (var i in contactListToBeRemove) {

                    contactListToBeRemove[i].people_list_id = loginSession.id;
                }
                if (contactListToBeAdded.length > 0)
                    updatePromisses.push(listService.addUsersToContactList(contactListToBeAdded));
                if (contactListToBeRemove.length > 0)
                    updatePromisses.push(listService.removeUsersFromContactList(contactListToBeRemove));


                $q.all(updatePromisses).then(function (results) {
                    if (results.length > 0) {

                    }
                }, function (errors) {
                    if (error.status === 400)
                        alert(error.data.Message);
                    else
                        alert("Network issue");
                });
                $scope.openSucessfullPopup();
                $cookieStore.remove('Name');
                $cookieStore.remove('Description');
                $cookieStore.remove('tagsToBeAdded');
                $state.go('app.list');
         
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
                size: 'sm',
                resolve: { items: { title: "List" } }
            });
            $rootScope.$broadcast('REFRESH', 'ListGrid');
        }


        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {
                ProjectCreate($scope.params);
                $scope.showValid = false;
            }

        }
        $scope.backtagList = function ()
        {
            $state.go('app.tagList');
        };

    
        

    });
