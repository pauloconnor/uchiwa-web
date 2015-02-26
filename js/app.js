'use strict';

angular.module('uchiwa', [
  'uchiwa.controllers',
  'uchiwa.constants',
  'uchiwa.directives',
  'uchiwa.factories',
  'uchiwa.filters',
  'uchiwa.providers',
  'uchiwa.services',
  // Angular dependencies
  'ngCookies',
  'ngRoute',
  'ngSanitize',
  // 3rd party dependencies
  'toastr',
  'ui.bootstrap'
]);

angular.module('uchiwa')
.config(['$httpProvider', '$routeProvider', '$tooltipProvider',
  function ($httpProvider, $routeProvider, $tooltipProvider) {
    // Token injection
    $httpProvider.interceptors.push('authInterceptor');

    // Routing
    $routeProvider
      .when('/', {redirectTo: function () {
        return '/events';
      }})
      .when('/login', {templateUrl: 'bower_components/uchiwa-web/partials/login/index.html', controller: 'login'})
      .when('/events', {templateUrl: 'bower_components/uchiwa-web/partials/views/events.html', reloadOnSearch: false, controller: 'events'})
      .when('/client/:dcId/:clientId', {templateUrl: 'bower_components/uchiwa-web/partials/client/index.html', reloadOnSearch: false, controller: 'client'})
      .when('/clients', {templateUrl: 'bower_components/uchiwa-web/partials/views/clients.html', reloadOnSearch: false, controller: 'clients'})
      .when('/checks', {templateUrl: 'bower_components/uchiwa-web/partials/views/checks.html', reloadOnSearch: false, controller: 'checks'})
      .when('/grid', {templateUrl: 'bower_components/uchiwa-web/partials/views/grid.html', reloadOnSearch: false, controller: 'grid'})
      .when('/info', {templateUrl: 'bower_components/uchiwa-web/partials/views/info.html', controller: 'info'})
      .when('/stashes', {templateUrl: 'bower_components/uchiwa-web/partials/views/stashes.html', reloadOnSearch: false, controller: 'stashes'})
      .when('/settings', {templateUrl: 'bower_components/uchiwa-web/partials/views/settings.html', controller: 'settings'})
      .when('/aggregates', {templateUrl: 'bower_components/uchiwa-web/partials/views/aggregates.html', reloadOnSearch: false, controller: 'aggregates'})
      .when('/aggregates/:dcId/:checkId', {templateUrl: 'bower_components/uchiwa-web/partials/views/check_aggregates.html', reloadOnSearch: false, controller: 'check_aggregates'})
      .when('/aggregates/:dcId/:checkId/:issuedId', {templateUrl: 'bower_components/uchiwa-web/partials/views/check_issue_aggregates.html', reloadOnSearch: false, controller: 'check_issue_aggregates'})
      .otherwise('/');
    $tooltipProvider.options({'placement': 'bottom'});
  }
])
.run(function (backendService, conf, $cookieStore, $location, notification, $rootScope, titleFactory) {
  $rootScope.alerts = [];
  $rootScope.events = [];
  $rootScope.partialsPath = 'bower_components/uchiwa-web/partials';
  $rootScope.skipRefresh = false;
  $rootScope.enterprise = conf.enterprise;

  $rootScope.titleFactory = titleFactory;

  backendService.getConfig();

  // fetch the sensu data on every page change
  $rootScope.$on('$routeChangeSuccess', function () {
    backendService.update();
    $rootScope.auth = $cookieStore.get('uchiwa_auth') || false;
  });

  $rootScope.$on('notification', function (event, type, message) {
    if ($location.path() !== '/login') {
      notification(type, message);
      if (type === 'error') {
        console.error(type + ': '+ JSON.stringify(message));
      }
    }
  });
});
