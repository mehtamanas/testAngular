angular.module('blogs', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.integration', {
                url: '/integration',
                templateUrl: 'blogs/integration.html',
                controller: 'IntegrationController',

            })
         .state('app.addBlog', {
             url: '/addBlog',
             templateUrl: 'blogs/create/blogCrate.html',
             controller: 'CreateBlogCtrl',

         })


        .state('app.editBlog', {
            url: '/editBlog?id',
            templateUrl: 'blogs/edit/blogEdit.html',
            controller: 'EditBlogCtrl',

        })

    }]);