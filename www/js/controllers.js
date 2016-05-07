angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $rootScope, Auth, $state) {


    $scope.login = function() {
        $rootScope.iniciarSesionGoogle();
    };



})

.controller('ProductsController', function($scope, $rootScope, Auth, $window) {
    $scope.productos = [];

    $scope.listarProductosCliente = function() {
        Auth.listarProductos($window.localStorage.email, $window.localStorage.token).then(function(data) {
           var producto;
           console.log(data.data);
            for (producto = 0; producto < data.data.length; producto++) {
                console.log(data.data[producto])
                $scope.productos.push(data.data[producto]);
            }
        }).catch(function(error) {
            console.log(error);
        })

    }
})
