angular.module('contacts')
.controller('tagListCtrl',
function ($scope, $state, $cookieStore, apiService, $rootScope, $window, $q, listService, $modal, $localStorage) {
    console.log('tagListCtrl');
    $scope.tagFilter = '';
    $scope.tagSelected = true;
    contactData = {
        teamId: window.sessionStorage.selectedCustomerID,
        orgId: $cookieStore.get('orgID')
    }

    $scope.usersInTeam = undefined;
    $scope.orgUsers = undefined;

    var currentlyLoggedInUserId = $cookieStore.get('userId');
    var taglist = null;

    $scope.showTags = function () {
        $scope.tagSelected = true;
        $scope.listSelected = false;
    }
    $scope.showList = function () {
        $scope.tagSelected = false;
        $scope.listSelected = true;
    }

    $scope.loadUsers = function () {
        // Use $q.all to get both the result and then process the result
        var teamPromise = listService.getOrgUsers(contactData.orgId);
        var orgPromise = listService.getUsersInTeam();

        var promises = [teamPromise, orgPromise];

        $q.all(promises).then(function (values) {
            $scope.usersInTeam = values[0].data;
            $scope.orgUsers = _.filter(values[1].data);

            for (i = 0; i < $scope.orgUsers.length; i++) {
                $scope.orgUsers[i].Name = $scope.orgUsers[i].name;
            }
            if ($cookieStore.get('tagsToBeAdded')) {
                $scope.tagslist=   $cookieStore.get('tagsToBeAdded');
                //if user has clicked baqck from next page
                
                for (i = 0; i < $scope.tagslist.length; i++)
                {
                    var a = ($cookieStore.get('tagsToBeAdded'))[i].tag_id;
                    var userObject = (_.findWhere($scope.orgUsers, { id: a }));
                    $scope.addUser(userObject);
                }
               
            }

            // Now, find out the users already in the team and mark them
            angular.forEach($scope.usersInTeam, function (existingUser) {
                var existingOrgUser = _.findWhere($scope.orgUsers, { user_id: existingUser.id });
                if (existingOrgUser) existingOrgUser.isTeamMember = true;
            })
        });
    };

    //if ($cookieStore.get('Taglist')) { //if user has clicked baqck from next page

    //    var taglistID = $cookieStore.get('Taglist');
    //    $scope.addUser(taglistID);
    //}


    $scope.loadList = function () {

        var listPromise = listService.getUsersInList($cookieStore.get('userId'));

        var promises = [listPromise];

        $q.all(promises).then(function (values) {
            $scope.orgList = _.filter(values[0].data);


            angular.forEach($scope.orgList, function (list) {//adda property isSelected
                list.isSelected = false;
            })
        });
    };

    $scope.loadUsers();
    $scope.loadList();
    leadDataSource = [];
    NewPeopleList = [];
    $scope.GetpeoplebyTags = function () {
        apiService.get('Contact/GetpeoplebyTags?id=' + $cookieStore.get('orgID') + '&type=' + taglist).then(function (response) {

            var data = response.data;

            for (i = 0; i < data.length; i++) {
                var tag = (data[i].Tags);
                if (tag !== null) {
                    tag = JSON.parse(tag);
                    data[i].Tags = [];
                    data[i].Tags = tag;
                }
                else
                    data[i].Tags = [];
            }
            leadDataSource = data;
            leadDataSource = leadDataSource.concat(NewPeopleList);
            refreshGrid();
        });
    };


    $scope.tagGrid = {
        dataSource: {
            type: "json",
            transport: {
                read: function (options) {
                    if (leadDataSource)
                    { options.success(leadDataSource); }
                        //apiService.get('Contact/GetpeoplebyTags?id=' + $cookieStore.get('orgID') + '&type=' + taglist).then(function (response) {
                        //    data = response.data;                          
                        //    for (i = 0; i < data.length; i++) {
                        //        var tag = (data[i].Tags);
                        //        if (tag !== null) {
                        //            tag = JSON.parse(tag);
                        //            data[i].Tags = [];
                        //            data[i].Tags = tag;
                        //        }
                        //        else
                        //            data[i].Tags = [];
                        //    }
                            
                        //    options.success(data);
                        //}, function (error) {
                        //    options.error(error);
                        //});
                    }
                    
                
            },
            pageSize: 20
        },
        schema: {
            model: {
                fields: {
                    Contact_Created_Date: { type: "date" }
                }
            }
        },

        groupable: true,
        sortable: true,
        selectable: "multiple",
        reorderable: true,
        resizable: true,
        filterable: true,
        height: screen.height - 370,
        columnMenu: {
            messages: {
                columns: "Choose columns",
                filter: "Apply filter",
                sortAscending: "Sort (asc)",
                sortDescending: "Sort (desc)"
            }
        },
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [
             {
                 field: "Name",
                 title: "Name",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             }, {
                 field: "Contact_Email",
                 title: "Primary Email",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             }, {
                 field: "City",
                 title: "Location",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             }, {
                 field: "Tags",
                 template: "<span ng-repeat='tag in dataItem.Tags' style='background-color:{{tag.background_color}}; margin-bottom: 5px;line-height:1.2em;' class='properties-close  upper tag-name' ng-hide='{{$index>1}}'>{{tag.name}}</span><br><span  ng-hide='{{dataItem.Tags.length<3}}'><small>Show More..</small></span>",
                 title: "TAGS",
                 width: "220px",

                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
        ]

    };


    $scope.loadUsers();

    if ($cookieStore.get('tagsToBeAdded')) {
        var a = ($cookieStore.get('tagsToBeAdded')).tag_id;
        $scope.orgUsers
    }

    usersToBeRemoved = [];
    usersToBeAdded = [];

    listToBeRemoved = [];
    listToBeAdded = [];
    
    // Get the collection of users to be removed
    $scope.removeUser = function (user) {
        if (user.isTeamMember) {
            user.isTeamMember = false;

            var existingUsers = _.pluck($scope.usersInTeam, 'id');

            // Do not add to remove list if the user is not already present in the server.
            if (existingUsers.indexOf(user.id) > -1 && usersToBeRemoved.indexOf(user.id) == -1)
            {
                usersToBeRemoved.push(user.id);
                
                //$cookieStore.put('Taglist', taglist);
            }
            
            // Remove the user if just added
            usersToBeAdded = _.remove(usersToBeAdded, function (removeMe) {
                return removeMe !== user.id;
            });
            taglist = usersToBeAdded.join(',');
            $scope.GetpeoplebyTags();
        }
        
    };


    $scope.removeList = function (list) {
        if (list.isSelected) {
            list.isSelected = false;

            var existingList=[];

            // Do not add to remove list if the user is not already present in the server.
            if (existingList.indexOf(list.Contact_Id) > -1 && listToBeRemoved.indexOf(list.Contact_Id) == -1)
            {
                usersToBeRemoved.push(list.Contact_Id);
                
            }
                
            // Remove the user if just added
            listToBeAdded = _.remove(listToBeAdded, function (removeMe) {
                return removeMe !== list.Contact_Id;
            });
            _.remove(NewPeopleList, function (removeMe) {
                return removeMe.Contact_Id == list.Contact_Id;
            });
            _.remove(leadDataSource, function (removeMe) {
                return removeMe.Contact_Id == list.Contact_Id;
            });

            refreshGrid();
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

                    taglist = usersToBeAdded.join(',');
                    $scope.GetpeoplebyTags();
                }
            }

            // Remove the user if just added
            usersToBeRemoved = _.remove(usersToBeRemoved, function (removeMe) {
                return removeMe == user.id;
            });
                    }
        else {
            $scope.removeUser(user);

        }
            
    };

    $scope.addList = function (list) {
        if (!list.isSelected) {
            list.isSelected = true;
            
            var existingList=[];

            // User should not be already existing and do not add duplicate entry
            if (existingList.indexOf(list.Contact_Id) == -1 && listToBeAdded.indexOf(list.Contact_Id) == -1) {
                {
                    listToBeAdded.push(list.Contact_Id);
                    NewPeopleList.push(list);
                    leadDataSource.push(list);
                    refreshGrid();
                }
            }

            // Remove the user if just added
            listToBeRemoved = _.remove(listToBeRemoved, function (removeMe) {
                return removeMe == list.Contact_Id;
            });
        }
        //taglist = listToBeAdded;
        else
        {
        //    NewPeopleListByPerson.pop(list);
            $scope.removeList(list);
        }
    };

    var refreshGrid = function () {
        $('.k-i-refresh').trigger("click");
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
            newMember.people_list_id = "";
            newMember.organization_id = contactData.orgId;

            usersToBeAddedOnServer.push(newMember)


        });

        // Remove the selected users
        var removePromisses = [];
        angular.forEach(usersToRemove, function (userId) {
            var existingMember = {};
            existingMember.tag_id = userId;
            existingMember.user_id = currentlyLoggedInUserId;
            existingMember.people_list_id = "";
            existingMember.organization_id = contactData.orgId;

            usersToBeRemovedOnServer.push(existingMember)

        });

    }

    $scope.updateList = function () {

        // remove already existing user if they are removed and added again
        var listToAdd = listToBeAdded;

        // get only the existing users to be removed to avoid unnecessary calls
        var listToRemove = listToBeRemoved;

        // Clear the temp arrays for next time
        listToBeAdded = [];
        listToBeRemoved = [];

        listToBeAddedOnServer = [];
        listToBeRemovedOnServer = [];

        // Add the new users
        var updatePromisses = [];
        angular.forEach(listToAdd, function (listId) {
            var newMember = {};
            newMember.contact_id = listId;
            newMember.user_id = currentlyLoggedInUserId;
            newMember.people_list_id = "";
            newMember.organization_id = contactData.orgId;

            listToBeAddedOnServer.push(newMember)


        });

        // Remove the selected users
        var removePromisses = [];
        angular.forEach(listToRemove, function (listId) {
            var existingMember = {};
            existingMember.tag_id = listId;
            existingMember.user_id = currentlyLoggedInUserId;
            existingMember.people_list_id = "";
            existingMember.organization_id = contactData.orgId;

            listToBeRemovedOnServer.push(existingMember)

        });

    }

    $scope.contactsummary = function () {
        $scope.updateTeamUsers();
        $scope.updateList();
        $cookieStore.put('tagsToBeAdded', usersToBeAddedOnServer);
        $cookieStore.put('tagsToBeRemove', usersToBeRemovedOnServer);
        $cookieStore.put('ContacListToBeAdded', listToBeAddedOnServer);
        $cookieStore.put('ContacListToBeRemove', listToBeRemovedOnServer);
        $state.go('app.listSummary');
    }

    $scope.saveList = function () {
        $scope.updateTeamUsers();
        $scope.updateList();
        $cookieStore.put('tagsToBeAdded', usersToBeAddedOnServer);
        $cookieStore.put('tagsToBeRemove', usersToBeRemovedOnServer);
        $cookieStore.put('ContacListToBeAdded', listToBeAddedOnServer);
        $cookieStore.put('ContacListToBeRemove', listToBeRemovedOnServer);

        $state.go('app.listSummary');
    }

    $scope.cancel = function ()
    {

    };

    $scope.backlist = function ()
    {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'contacts/list/addList.html',
            backdrop: 'static',
            controller: addListCtrl,
            size: 'lg'
        });
    
    };
});