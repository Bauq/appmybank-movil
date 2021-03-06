angular.module('starter.services', [])
    .factory('Auth', function($firebaseAuth, $rootScope, $state, $window, $http, $ionicPopup, $ionicLoading) {
        var usersRef = new Firebase("https://mybankapp.firebaseio.com//users");
        //var usersRef = new Firebase("https://radiant-inferno-2748.firebaseio.com/users");
        var user;
        var conexionLegacyApi = "http://mybank-legacy-api.herokuapp.com/api/v2/";
        var conexionExternalApi = "https://external-api-test.herokuapp.com/";

        $rootScope.eliminarUsuarioFirebase = function() {
            usersRef.child($rootScope.uid).once('value', function(snapshot) {
                if (snapshot.exists()) {
                    snapshot.ref().remove();
                }
            });
        };

        $rootScope.show = function(text) {
            $rootScope.loading = $ionicLoading.show({
                template: '<p class="item-icon-left">' + text + '<ion-spinner class= "spinner-energized" icon="crescent"/></p>',
            });
        };

        $rootScope.hide = function() {
            $ionicLoading.hide();
        };

        $rootScope.showAlert = function(titulo, cuerpo) {
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: cuerpo
            });
        };

        $rootScope.salir = function() {
            $window.localStorage.email = "";
            $window.localStorage.nombreUsuario = "";
            $window.localStorage.token = "";
            $window.localStorage.fotoPerfil = "";
            $state.go('login');
        };

        $rootScope.iniciarSesionGoogle = function() {
            usersRef.authWithOAuthPopup("google", function(error, authData) {
                if (!error) {
                    $rootScope.uid = authData.uid;
                    $window.localStorage.email = authData.google.email;
                    $window.localStorage.nombreUsuario = authData.google.displayName;
                    $window.localStorage.token = authData.token;
                    $window.localStorage.fotoPerfil = authData.google.profileImageURL;
                    user = {
                        name: $window.localStorage.nombreUsuario,
                        email: $window.localStorage.email,
                        token: $window.localStorage.token
                    };
                    usersRef.child($rootScope.uid).once('value', function(snapshot) {
                        if (snapshot.exists()) {
                            snapshot.ref().update(user);
                        } else {
                            var payload = {};
                            payload[$rootScope.uid] = user;
                            snapshot.ref().parent().update(payload);
                        }
                    });
                    $http.get(conexionExternalApi + 'cliente/' + $window.localStorage.email + '/' + $window.localStorage.token).then(function(data) {
                        $state.go('app.main');
                    }).catch(function(error) {
                        $rootScope.eliminarUsuarioFirebase();
                        $rootScope.showAlert('error', error.data.error);
                    });

                }
            }, {
                remember: "sessionOnly",
                scope: "email"
            });
        };
        return {
            listarProductos: function(email, token) {
                return $http.get(conexionLegacyApi + 'producto/get/' + email + '?token=' + token);
            },
            mostrarEjecutivo: function(email, token) {
                return $http.get(conexionLegacyApi + 'ejecutivo/get/' + email + '?token=' + token);
            },
            mostrarMovimientosProductos: function(email, token, idProd) {
                return $http.get(conexionLegacyApi + 'movimiento/get/' + idProd + '/' + email + '?token=' + token);
            },
            mensajesNuevos: function(email, token) {
                return $http.get(conexionExternalApi + 'mensajes/' + email + '/' + token);
            },
            enviarMensaje: function(emailCliente, emailAsesor, mensaje, token) {
                return $http.get(conexionExternalApi + 'mensaje/' + emailCliente + '/' + emailAsesor + '/' + mensaje + '/' +
                    token);
            },
            mostrarMensajes: function(token){
                return $http.get(conexionExternalApi+'mensajest/'+token);
            }


        }

    });