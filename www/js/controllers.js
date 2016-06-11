angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $rootScope, Auth, $state) {


    $scope.login = function() {
        $rootScope.iniciarSesionGoogle();
    };
})

.controller('ProductsController', function($scope, $rootScope, Auth, $window, $ionicModal) {

    $scope.nombreUsuario = $window.localStorage.nombreUsuario;
    $scope.email = $window.localStorage.email;
    $scope.fotoPerfil = $window.localStorage.fotoPerfil;

    $scope.listarProductosCliente = function() {
        Auth.listarProductos($window.localStorage.email, $window.localStorage.token).then(function(data) {
            $scope.productos = [];
            $rootScope.show();
            var producto;
            for (producto = 0; producto < data.data.length; producto++) {
                $scope.productos.push(data.data[producto]);
            }
            $rootScope.hide();
        }).catch(function(error) {
            $rootScope.showAlert('error', error.data.data);
            $state.go('login');
        })
    }
    $scope.descripcion = function(producto) {
        $scope.movimientos = [];
        $scope.productoDescrip = {
            nombre: '',
            tipo: '',
            saldo: 0
        };
        $scope.productoDescrip.nombre = producto.nombre;
        $scope.productoDescrip.tipo = producto.tipo;
        $scope.productoDescrip.saldo = producto.saldo;

        Auth.mostrarMovimientosProductos($window.localStorage.email, $window.localStorage.token, producto.id).then(function(data) {
            var movimiento;
            for (movimiento = 0; movimiento < data.data.length; movimiento++) {
                $scope.movimientos.push(data.data[movimiento]);
            }
        }).catch(function(error) {
            $rootScope.showAlert('error', error.data.data);
        })
        $scope.detalleProducto.show();
    }

    $ionicModal.fromTemplateUrl('detalleProducto.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.detalleProducto = modal;
    });
})


.controller('EjecutivoController', function($scope, $rootScope, $cordovaContacts, $cordovaGeolocation, Auth, $state, $window) {
    $scope.ejecutivos = [];
    $scope.nombreUsuario = $window.localStorage.nombreUsuario;
    $scope.email = $window.localStorage.email;
    $scope.fotoPerfil = $window.localStorage.fotoPerfil;

    $scope.mostrarEjecutivo = function() {
        Auth.mostrarEjecutivo($window.localStorage.email, $window.localStorage.token).then(function(data) {
            $scope.contact = data.data;
            $window.localStorage.nombreEmpleado = $scope.contact.nombre;
            $window.localStorage.fotoEmpleado = $scope.contact.foto;
            $window.localStorage.correoEmpleado = $scope.contact.correo;
            $scope.mostrarMapa();
        }).catch(function(error) {
            $rootScope.showAlert('error', error.data.error);
            $state.go('login');
        });

    }


    $scope.anadirContacto = function() {

        $scope.contacto = {
            "displayName": $scope.contact.nombre,

            "phoneNumbers": [{
                "value": $scope.contact.celular,
                "type": "mobile"
            }],
            "emails": [{
                "value": $scope.contact.correo,
                "type": "home"
            }]
        };

        $cordovaContacts.find({
            filter: $scope.contact.nombre,
            fields: ['displayName']
        }).then(function(datoContacto) { //replace 'Robert' with '' if you want to return all contacts with .find()
            if (JSON.stringify(datoContacto) == "[]") {
                $cordovaContacts.save($scope.contacto).then(function(result) {
                    $rootScope.showAlert("Proceso exitoso, el contacto se ha almacenado en su teléfono");
                }, function(err) {
                    $rootScope.showAlert("Ha ocurrido un error, por favor intente más tarde")
                });
            } else {

            }
        });
    };

    $scope.mostrarMapa = function() {
        var options = {
            timeout: 10000,
            enableHighAccuracy: true
        };

        var latLng = new google.maps.LatLng($scope.contact.latitud, $scope.contact.longitud);
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            position: latLng,
            map: $scope.map,
            title: 'Hello World!'
        });
    };

})

.controller('ChatController', function($scope, $rootScope, Auth, $state, $window) {

    var alternate,
        isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {
        alternate = !alternate;

        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

        $scope.messages.push({
            userId: alternate ? '12345' : '54321',
            text: $scope.data.message,
            time: d
        });

        delete $scope.data.message;
        $ionicScrollDelegate.scrollBottom(true);

    };


    $scope.inputUp = function() {
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true);
        }, 300);

    };

    $scope.inputDown = function() {
        if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function() {
        // cordova.plugins.Keyboard.close();
    };

   
    $scope.mensaje = {
        mensaje: ''
    };

    $scope.mostrarChat = function() {
         $scope.nombreUsuario = $window.localStorage.nombreUsuario;
    $scope.email = $window.localStorage.email;
    $scope.fotoPerfil = $window.localStorage.fotoPerfil;
    $scope.fotoEmpleado = $window.localStorage.fotoEmpleado;
    $scope.nombreEmpleado = $window.localStorage.nombreEmpleado;
    $scope.correoEmpleado = $window.localStorage.correoEmpleado;
        if ($scope.nombreEmpleado == "undefined") {
            Auth.mostrarEjecutivo($window.localStorage.email, $window.localStorage.token).then(function(data) {
                $scope.nombreEmpleado = data.data.nombre_completo;
                $scope.fotoEmpleado = data.data.foto;
                $scope.correoEmpleado = data.data.correo;
            }).catch(function(error) {
                $rootScope.showAlert('error', error.data.error);
            });
        }
        Auth.mostrarMensajes($window.localStorage.token).then(function(data) {
            console.log(data);
            $scope.mensajes = data.data;
        }).catch(function(error) {
            $rootScope.showAlert('error', error.data.error);

        });
    };

    $scope.enviar = function() {
        console.log("enviar")
        if ($scope.mensaje != '') {
            Auth.enviarMensaje($window.localStorage.email, $scope.correoEmpleado, $scope.mensaje.mensaje, $window.localStorage.token).then(function(data) {
                $rootScope.showAlert('', data.data);
                $scope.mensaje.mensaje = '';
                $scope.mostrarChat();
            }).catch(function(error) {
                $rootScope.showAlert('error', error.data.error);
            })
        }
    };

    $scope.inputUp = function() {
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function() {
            $ionicScrollDelegate.scrollBottom(true);
        }, 300);

    };

    $scope.inputDown = function() {
        if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
    };

})
