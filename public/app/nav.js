angular.module('app.nav', [])

.directive('citjournNav', function(){
    return {
        templateUrl: './public/views/nav.html',
        restrict: 'E',
        controller: 'navCtrl'
    };
})

.controller('navCtrl', function() {
    console.log("Nav working");
});
