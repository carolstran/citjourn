angular.module('app.comments', [])

.controller('singleImageCtrl', function($scope, $stateParams, $http) {
    $scope.showComments = false;

    $http({
        method: 'GET',
        url: `/singleImage/${$stateParams.id}`,
        params: { id: $stateParams.id }
    }).then(function(res) {
        $scope.image = res.data[0];
        $scope.image.id = res.data[0].id;
    }).catch(function(err) {
        console.log('Unable to get single image - client side', err);
    });

    $http({
        method: 'GET',
        url: `/commentsForImage/${$stateParams.id}`,
        params: { id: $stateParams.id }
    }).then(function(res) {
        $scope.comments = res.data.comments;
    }).catch(function(err) {
        console.log('Unable to get comments for image - client side', err);
    });

    $scope.submitComment = function(comment) {
        let imageId = $scope.image.id;

        return $http({
            method: 'POST',
            url: `/newComment/${imageId}`,
            data: $.param({
                username: comment.username,
                comment: comment.comment
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(data) {
            $scope.comments.push({
                username: comment.username,
                comment: comment.comment
            });
        }).catch(function(err) {
            console.log('Unable to submit comment - client side', err);
        });
    };

    $scope.verifyImage = function() {
        $http({
            method: 'POST',
            url: `/singleVerify/${$stateParams.id}`,
            data: $.param({
                verified: $scope.image.verified + 1,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function(res) {
            $scope.image.verified += 1;
        }).catch(function(err) {
            console.log('Unable to verify image - client side', err);
        });
    };


});
