angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $rootScope, Auth, $state) {


    $scope.login = function() {
        $rootScope.iniciarSesionGoogle();
    };
})

.controller('ProductsController', function($scope, $rootScope, Auth, $window) {
    $scope.productos = [];
    $scope.nombreUsuario= $window.localStorage.nombreUsuario;
    $scope.email = $window.localStorage.email;
    $scope.fotoPerfil = $window.localStorage.fotoPerfil;
    $scope.listarProductosCliente = function() {
        Auth.listarProductos($window.localStorage.email, $window.localStorage.token).then(function(data) {
          $rootScope.show();
           var producto;
            for (producto = 0; producto < data.data.length; producto++) {
                $scope.productos.push(data.data[producto]);
            }
          $rootScope.hide();
        }).catch(function(error) {
            $rootScope.showAlert('error',error.data.data);
        })

    }
})
