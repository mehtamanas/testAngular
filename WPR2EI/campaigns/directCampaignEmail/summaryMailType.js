angular.module('campaigns')
.controller('summaryMailTypeCtrl',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, $q, emailService, $localStorage) {

        var userId = $cookieStore.get('userId');
        var emailTemplate = JSON.parse(window.localStorage.getItem("emailAddTemplate"));
        window.localStorage.removeItem('emailAddTemplate');
        var tagToBeAdded = $cookieStore.get('usersToBeAddedOnServer1');
        var tagToBeRemove = $cookieStore.get('usersToBeRemovedOnServer1');
        $scope.totalperson = $cookieStore.get('totalPersonCount');
        $scope.start_date = $cookieStore.get('htmldate1');

        $scope.params = {};

        $scope.fromEmail = $cookieStore.get('currentUser');
        $scope.fromEmail = $scope.fromEmail.account_email;

        $scope.Contacts = $localStorage.contactDetails;
     
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
            end_date: $cookieStore.get('End_Date'),
            Street_1: $cookieStore.get('Address'),
            start_date1: moment($cookieStore.get('Start_Date'))._d,
            end_date: moment($cookieStore.get('Start_Date'))._d,
            budget: $cookieStore.get('Budget'),
            no_of_leads: $cookieStore.get('No_of_leads'),
            sales: $cookieStore.get('Sales'),
            channel_type_id: "ACD2A25F-D8D0-4554-8DA4-9D2FB5200E61",
            campaign_ID: $cookieStore.get('campaign_id'),
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId'),
            tag_id: $cookieStore.get('usersToBeAddedOnServer1'),
            project_id: $cookieStore.get('project_id'),
            description: emailTemplate.description,
            campaign_subtype: emailTemplate.campaign_subtype
        }


        projectUrl = "CampaignEvent/Create";
        ProjectCreate = function (param) {
            apiService.post(projectUrl, param).then(function (response) {
                var loginSession = response.data;

                var updatePromisses = [];
                $scope.postData = {
                    campaign_event_id: loginSession.id,
                    subject: emailTemplate.subject,
                    template_id: emailTemplate.template_id,
                    description: emailTemplate.template,
                    document_type_id: emailTemplate.document_type_id,
                    fromEmail: $scope.fromEmail,
                    organization_id: $cookieStore.get('orgID'),
                    user_id: $cookieStore.get('userId'),
                }
                if (emailTemplate.template_id != undefined) {
                    emailUrl = "CampaignEmailTemplate/Create";
                    apiService.post(emailUrl, $scope.postData).then(function (response) {
                        var SessionData = response.data;
                       // $scope.RemoveCookies();
                        $state.go('app.contactDetails');
                    },
                    function (error) {
                        if (error.status === 400)
                            alert(error.data.Message);
                        else
                            alert("Network issue");
                    })
                }

                for (var i in tagToBeAdded) {

                    tagToBeAdded[i].campaign_id = loginSession.id;
                }
                for (var i in tagToBeRemove) {

                    tagToBeRemove[i].campaign_id = loginSession.id;
                }
                if (tagToBeAdded.length > 0)
                    updatePromisses.push(emailService.addUsersToTeam(tagToBeAdded));
                if (tagToBeRemove.length > 0)
                    updatePromisses.push(emailService.removeUsersFromTeam(tagToBeRemove));


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
                $state.go('app.contactDetails');
                $rootScope.$broadcast('REFRESH', 'projectGrid');

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
                templateUrl: 'campaigns/emailCampaign/sucessfullCampaign.tpl.html',
                backdrop: 'static',
                controller: sucessfullCampaginController,
                size: 'lg',
                resolve: { items: { title: "Email campaign" } }
            });
        }


        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {
                ProjectCreate($scope.params);
                $scope.showValid = false;

            }

        }


        //$scope.RemoveCookies = function () {
        //    $cookieStore.remove('Name');
        //    $cookieStore.remove('End_Date');
        //    $cookieStore.remove('Address');
        //    $cookieStore.remove('Start_Date');
        //    $cookieStore.remove('Budget');
        //    $cookieStore.remove('No_of_leads');
        //    $cookieStore.remove('project_id');
        //    $cookieStore.remove('Sales');
        //    $cookieStore.remove('channel_type_id');
        //    $cookieStore.remove('campaign_ID');
        //    $cookieStore.remove('usersToBeAddedOnServer1');
        //    $state.go('app.addDirectMailCampaign');
        //}

        $scope.cancel = function () {
            $cookieStore.remove('Name');
            $cookieStore.remove('End_Date');
            $cookieStore.remove('Address');
            $cookieStore.remove('Start_Date');
            $cookieStore.remove('Budget');
            $cookieStore.remove('No_of_leads');
            $cookieStore.remove('project_id');
            $cookieStore.remove('Sales');
            $cookieStore.remove('channel_type_id');
            $cookieStore.remove('campaign_ID');
            $state.go('app.addDirectMailCampaign');
        };

        $scope.back = function () {
            $state.go('app.directMailType');
        }

    });
