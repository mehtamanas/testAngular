angular.module('app.modules.organization.settings', [])

.config(function($stateProvider) {
    $stateProvider
        .state('loggedIn.modules.organization.settings', {
            url: '/settings',
            views: {
                'main-content@loggedIn.modules': {
                    templateUrl: 'app/modules/organization/settings/settings.tpl.html',
                    controller: 'OrganizationSettingsController'
                }
            },
            data: {pageTitle: 'Organization Setting'}
        });
})

.controller('OrganizationSettingsController',
    function($scope, $state, orgs) {
        console.log("OrganizationSettingsController");

        $scope.currentOrg = {
            id: '458D25498TRG478',
            createdBy: 'Himangshu Maity',
            createdDate: '05/05/2015',

            organizationName: 'CB Digitals',
            primaryContacts: 'Himangshu Maity',
            divisions: 'Development',
            address: '142, Bidhan park, Kolkata-90',
            year: '2008',
            currency: 'INR',

            phone: '033-56844695',
            fax: '033-548796',
            language: 'English',
            timeZone: '+5:30 (GMT)',
            usedData: '5.6GB',
            usedFile: '5.6GB'
        };

        orgs.get().then(function(response) {
            if(response.length > 0) {
                var orgInfo = response[0];
                console.log(orgInfo);
                $scope.currentOrg.id = orgInfo.entity_key_id;
                $scope.currentOrg.organizationName = orgInfo.name;
                $scope.currentOrg.primaryContacts = orgInfo.primary_contacts;
                $scope.currentOrg.divisions = orgInfo.divisions;
                $scope.currentOrg.address = orgInfo.address;
                $scope.currentOrg.year = orgInfo.financial_year_starts_in;
                $scope.currentOrg.currency = orgInfo.corporate_currency;
                $scope.currentOrg.phone = orgInfo.phone;
                $scope.currentOrg.fax = orgInfo.fax;
            }
        }, function(error) {
            console.log(error);
        });
    }
);
