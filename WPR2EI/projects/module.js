
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
         .state('app.generateDemandLetter', {
             url: '/project/DemandLetter?id',
             templateUrl: 'projects/demand_letter/demandLetter.html',
             controller: 'demandLetterCtrl',
             title: 'Demand Letter'
         })
        .state('app.generateDemandLetterTemplate', {
            url: '/project/demandLetterTemplate',
            templateUrl: 'projects/demand_letter/demandLetterTemplate.html',
            controller:'demandLetterCtrl',
            title: 'Demand Letter'
        })
         .state('app.demandLetterSend', {
             url: '/project/demandLetterSend',
             templateUrl: 'projects/demand_letter/sendDemandLetter.html',
             controller: 'sendDemandLetterCtrl',
             title: 'Demand Letter',
            
             })



             
    }]);
