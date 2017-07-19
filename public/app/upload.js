angular.module('app.upload', [])

    .controller('uploadImageCtrl', function($scope, $http, $state) {
        $scope.submitUpload = function(image) {
            let file = $('input[type="file"]').get(0).files[0];

            if (file) {
                let formData = new FormData();

                formData.append('file', file);
                formData.append('username', image.username);
                formData.append('title', image.title);
                formData.append('description', image.description);

                return $http({
                    method: 'POST',
                    url: '/uploadImage',
                    data: formData,
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                }).then(function(data) {
                    $state.go('feed');
                });
            }
        };
    });
