
angular.module('project', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.project', {
                url: '/projects',
                templateUrl: 'projects/project.tpl.html',
                controller: 'projectListController',
                title: 'Projects'
            })
        .state('app.projectdetail', {
            url: '/project/details',
            templateUrl: 'projects/ProjectDetail.tpl.html',
            controller: 'ProjectDetailController',
            title: 'Projects Details'
        })
         .state('app.contactDemandList', {
             url: '/project/contactDemandList',
             templateUrl: 'projects/demand_letter/contactList.html',
             controller: 'contactListCtrl',
             title: 'Contact List'
         })
        .state('app.demandLetterTemplate', {
            url: '/project/demandLetterTemplate',
            templateUrl: 'projects/demand_letter/demandLetterTemplate.html',
            controller: 'demandLetterTemplateCtrl',
            title: 'Demand Letter Template'
        })
         .state('app.demandLetterSend', {
             url: '/project/demandLetterSend',
             templateUrl: 'projects/demand_letter/sendDemandLetter.html',
             controller: 'sendDemandLetterCtrl',
             title: 'Demand Letter Send'
         })



             
    }]);
