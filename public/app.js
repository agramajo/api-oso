var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider,$httpProvider) {
    
    $routeProvider
    
    .when('/', {
        controller: 'Home',
        templateUrl: 'home.html',
        controllerAs: 'vm'
    })

    .when('/login', {
        controller: 'Login',
        templateUrl: 'login.html',
        controllerAs: 'vm'
    })

    .otherwise('/');

});

app.run(function($rootScope, $http, $location, $window) {
    // keep user logged in after page refresh
    if ($window.sessionStorage) {
        //$http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        $http.defaults.headers['x-access-token'] = $window.sessionStorage.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/login'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$window.sessionStorage.token) {
            $location.path('/login');
        }
    });
});

app.controller('Home', function($window) {
    var vm = this;

    var decoded = parseJwt($window.sessionStorage.token);

    console.log(decoded);

});

app.controller('Login', function($location, $http, $window) {
    var vm = this;
    vm.login = login;

    // ejecutamos logout por las dudas    
    (function logout() {
        delete $window.sessionStorage.token;
        $http.defaults.headers['x-access-token'] = '';
    })();

    function login() {
        $http
            .post('/api/auth', vm)
            .success(function (data, status, headers, config) {
                $window.sessionStorage.token = data.token;
                vm.error = 'Welcome';
                $location.path('/');
            })
            .error(function (data, status, headers, config) {
                delete $window.sessionStorage.token;
                vm.error = 'Error: Invalid user or password';
        });
    };
});

function parseJwt(token) {
	var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

/*
app.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        // config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        config.headers['x-access-token'] = $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});
*/
