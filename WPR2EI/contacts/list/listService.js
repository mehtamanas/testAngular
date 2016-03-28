/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('contacts')
    .service('listService', ['$http', 'apiService', '$window',
        function ($http, apiService) {
            var seletedCustomerId = window.sessionStorage.selectedCustomerID;
            if (seletedCustomerId == undefined)
            {
                seletedCustomerId = "a";
            }
            var orgId1 = window.sessionStorage.selectedorgid;
            this.get = function (url) {
                return $http.get(url);
            };

            this.getUsersInTeam = function (orgId) {

                return $http.get(apiService.baseUrl + 'Tags/GetAllTagsWithId?id=' + orgId1)
            };

            this.getUsersInList = function (userId) {

                return $http.get(apiService.baseUrl + "Contact/GetAllContactDetails?Id=" +userId + "&type=Lead")
            };


            this.getOrgUsers = function (orgId) {

                return $http.get(apiService.baseUrl + 'PeopleList/GetPeopleListById/' + seletedCustomerId + '/' + orgId1)
            };

            this.getOrgUsersInList = function (orgId) {

                return $http.get(apiService.baseUrl + 'Contact/GetAllContactDetails?Id=' + seletedCustomerId + "&type=Lead")
            };

            this.getEngagements = function () {
                return $http.get('');
            };
            // Add users
            this.addUsersToTeam = function (usersTobeAdded) {
                return $http.post(apiService.baseUrl + 'PeopleList/CreatePeopleList_Tag_Mapping', usersTobeAdded);
            };

            // Remove users
            this.removeUsersFromTeam = function (usersTobeRemoved) {
                
                return $http({
                    method: 'DELETE', url: apiService.baseUrl + 'PeopleList/DeleteMultiplePeopleTagMapping',
                    data: usersTobeRemoved, headers: { 'Content-Type': 'application/json' }
                });
            };

            // Add ContactList
            this.addUsersToContactList = function (listToBeAdded) {
                return $http.post(apiService.baseUrl + 'PeopleList/CreatePeopleList_Contact_Mapping', listToBeAdded);
            };

            // Remove ContactList
            this.removeUsersFromContactList = function (listToBeRemoved) {
                return $http({
                    method: 'DELETE', url: apiService.baseUrl + 'PeopleList/DeleteMultiplePeopleContactMapping',
                    data: listToBeRemoved, headers: { 'Content-Type': 'application/json' }
                });
            };
           

            this.AuditCreate = function (param) {

                $http.post(apiService.baseUrl + "AuditLog/Create", param).then(function (response) {
                    var loginSession = response.data;

                },
                function (error) {
                    if (error.status === 400)
                        alert(error.data.Message);
                    else
                        alert("Network issue");
                });


            };
        }]);