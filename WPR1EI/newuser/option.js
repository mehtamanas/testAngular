﻿var OptionPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal) {
    console.log('OptionPopUpController');


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Role" } }

        });
    }

    //Audit log start
    $scope.params = {

        device_os: "windows10",
        device_type: "mobile",
        device_mac_id: "34:#$::43:434:34:45",
        module_id: "Addnew Project",
        action_id: "Addnew Project View",
        details: "Addnew Project detail",
        application: "angular",
        browser: $cookieStore.get('browser'),
        ip_address: $cookieStore.get('IP_Address'),
        location: $cookieStore.get('Location'),
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId')
    };


    AuditCreate = function (param) {

        apiService.post("AuditLog/Create", param).then(function (response) {
            var loginSession = response.data;

        },
   function (error) {

   });
    };
    AuditCreate($scope.params);

    //end

    $scope.params = {
        name: $scope.name,
        project_id: $scope.Select_Project,
        address: $scope.address,
        city: $scope.city,
        state: $scope.state,
        country: "India",
        organization_id: $cookieStore.get('orgID'),
        userid: $cookieStore.get('userId')

    };




    Url = "project/Get/" + $cookieStore.get('orgID');

    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;

    },
                function (error) {
                    deferred.reject(error);
                    alert("not working");
                });
    //alert("hii pop");
    projectUrl = "PropertyListing/CreateProperty";
    ProjectCreate = function (param) {
        //alert(param.name);
        //alert(param.address);
        //alert(param.city);
        //alert(param.state);
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
           // alert("Property Created..!!");
            $modalInstance.dismiss();


            //alert(param.name);


        },
   function (error) {
       alert("Error " + error.state);
   });
    };

    Url = "GetCSC/city";

    apiService.get(Url).then(function (response) {
        $scope.cities = response.data;

    },
function (error) {
    alert("Error " + error.state);
});
    //alert($cookieStore.get('orgID'));

    if ($cookieStore.get('Selected Text') == "ASSIGN TO PROJECT") {

        Url = "Project/Get/" + $cookieStore.get('orgID');
        
    }
    else if ($cookieStore.get('Selected Text') == "ASSIGN ROLES") {
        Url = "Role/Get/442aa5f4-4298-4740-9e43-36ee021df1e7";

    }
    else if ($cookieStore.get('Selected Text') == "ADD TO TEAM") {

        Url = "Team/Get/" + $cookieStore.get('orgID');

    }



    apiService.get(Url).then(function (response) {
        $scope.states = response.data;

    },
function (error) {
    alert("Error " + error.state);
});

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
        //alert($scope.project_id);
    };

    $scope.selectstate = function () {
        $scope.params.state = $scope.state1;
        alert($scope.params.state);
    };


    $scope.selectcity = function () {
        $scope.params.city = $scope.city1;
        //alert($scope.city);
    };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function () {
        $scope.checkedIds = null;
        $scope.checkedIds = $cookieStore.get('checkedIds');

        var usersToBeAddedOnServer = [];

       
    
        var Url;
        if ($cookieStore.get('Selected Text') == "ASSIGN TO PROJECT") {
            for (var i in $scope.checkedIds) {
                var newMember = {};
                newMember.project_id = $scope.params.city;
                newMember.mapping_id = $scope.checkedIds[i];
                newMember.user_id = $cookieStore.get('userId');
                newMember.organization_id = $cookieStore.get('orgID');
                newMember.isteam = "0";
                usersToBeAddedOnServer.push(newMember);
            }
            
            Url = "Mapping/UserToProject";
            //$modalInstance.dismiss();
            //$scope.openSucessfullPopup();

        }
        else if ($cookieStore.get('Selected Text') == "ASSIGN ROLES") {
            for (var i in $scope.checkedIds) {
                var newMember = {};
                newMember.role_user_id = $scope.checkedIds[i];
                newMember.role_id = $scope.params.city;
                newMember.user_id = $cookieStore.get('userId');
                newMember.organization_id = $cookieStore.get('orgID');
                usersToBeAddedOnServer.push(newMember);
            }
            Url = "Mapping/UserToRole";
            //$modalInstance.dismiss();
            //$scope.openSucessfullPopup();

        }
        else if ($cookieStore.get('Selected Text') == "ADD TO TEAM") {
            // Add the new users
            for (var i in $scope.checkedIds) {
                var newMember = {};
                newMember.team_user_id = $scope.checkedIds[i];
                newMember.team_id =  $scope.params.city;
                newMember.user_id = $cookieStore.get('userId');
                newMember.organization_id = $cookieStore.get('orgID');
                usersToBeAddedOnServer.push(newMember);
            }

            Url = "Mapping/UserToTeam";
           //$modalInstance.dismiss();
           // $scope.openSucessfullPopup();

        }

        apiService.post(Url, usersToBeAddedOnServer).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
        },
   function (error) {

   });

    }

};