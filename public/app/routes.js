angular.module('app.routes', ['ui.router'])

    .config(function($stateProvider) {
        $stateProvider
            .state('feed', {
                url: '/',
                views: {
                    'main': {
                        templateUrl: './views/feed.html'
                    }
                }
            })

            .state('upload', {
                url: 'upload',
                views: {
                    'main': {
                        templateUrl: './views/upload.html'
                    }
                }
            })

            .state('image', {
                url: '/image/:id',
                views: {
                    'main': {
                        templateUrl: './views/image.html',
                        controller: "singleImageCtrl"
                    }
                }
            });
    });
