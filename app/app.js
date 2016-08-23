var app = angular.module('app',['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('/', {
            url: "/",
            templateUrl: "app/templates/main.html"
        })
});