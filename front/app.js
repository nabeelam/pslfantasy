var app = angular.module("myPSL", []);

app.controller("myC", function($scope){
    $scope.toggle = function (n) {
        $scope.activeTeam = n;
    };

    $scope.range = function (min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };
});
