
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

            .state('app.demandLetter', {
                url: '/project/DemandLetter?id',
                templateUrl: 'projects/demand_letter/demandLetter.html',
                controller: 'demandLetterCtrl',
                title: 'Demand Letter'
            })

            .state('app.demandLetter.generateList', {
                url: '/project/listOfContact',
                templateUrl: 'projects/demand_letter/demandLetter-contactList.html',
                title: 'Contact List'
            })

            .state('app.demandLetter.generateTemplate', {
                url: '/project/chooseTemplate',
                templateUrl: 'projects/demand_letter/demandLetter-template.html',
                title: 'Choose Template Letter'
            })

            .state('app.demandLetter.save', {
                url: '/project/SendLetter',
                templateUrl: 'projects/demand_letter/demandLetter-save.html',
                title: 'Save Letter',

            })




    }]);
