angular.module('myApp', ['app.routes', 'app.nav', 'app.upload', 'app.comments'])

    .controller('imageFeedCtrl', function($scope, $http) {
        $http.get('/imageFeed').then(function(res) {
            console.log(res.data);
            $scope.feed = res.data.feed;
        });

        $scope.imageLimit = 6;
        $scope.seeMoreImages = function(addImages) {
            $scope.imageLimit += addImages;
        };
    })

    .filter('reverse', function() {
        return function(items) {
            return items && items.slice().reverse();
        };
    });
