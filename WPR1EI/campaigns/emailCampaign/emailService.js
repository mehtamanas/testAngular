/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('campaigns')
    .service('emailService', ['$http', 'apiService','$window', 
        function ($http, apiService) {
             var seletedCustomerId = window.sessionStorage.selectedCustomerID;
            this.get = function(url){
              return $http.get(url);
            };

            this.getUsersInTeam = function () {
                return $http.get(apiService.baseUrl + 'Tags/GetAllTagsWithId' )
            };

            this.getOrgUsers = function (orgId) {
                return $http.get(apiService.baseUrl + 'CampaignTag/GetCampaignTag/' + seletedCustomerId + '/' + orgId)
            };

            this.getEngagements = function(){
                return $http.get('');
            };
            // Add users
            this.addUsersToTeam = function (usersTobeAdded) {
                return $http.post(apiService.baseUrl + 'CampaignTag/CreateCampaignTag', usersTobeAdded);
            };

            // Remove users
            this.removeUsersFromTeam = function (usersTobeRemoved) {
                return $http({
                    method: 'DELETE', url: apiService.baseUrl + 'Mapping/DeleteMultipleCampaignTag',
                    data: usersTobeRemoved, headers: { 'Content-Type': 'application/json' }
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