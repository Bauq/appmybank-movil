angular.module('starter.services', [])
    .factory('Auth', function($firebaseAuth, $rootScope, $state, $window, $http, $ionicPopup, $ionicLoading) {
        var usersRef = new Firebase("https//mybankatom.firebaseio.com/users");
        var user;
        var conexionLegacyApi = "http://mybank-legacy-api.herokuapp.com/api/";

        $rootScope.eliminarUsuarioFirebase = function(error) {
            usersRef.child($rootScope.uid).once('value', function(snapshot) {
                if (snapshot.exists()) {
                    snapshot.ref().remove(user);
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
            alertPopup.then(function(res) {
                $state.go('login');
            });
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
                    })
;                    $state.go('app.main');

                }
            }, {
                remember: "sessionOnly",
                scope: "email"
            });
        };
        return {
            listarProductos: function(email, token) {
                return $http.get(conexionLegacyApi + 'product/getByEmail?token=' + user.token);
                //return $http.get('http://mybank-legacy-api.herokuapp.com/api/product/getByEmail?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNhbXVlbHNheG9mb25AZ21haWwuY29tIiwicHJvdmlkZXJfaWQiOiIxMDI2NjQ5ODk3NDM0ODU5MTY0NDQiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlhdCI6MTQ2MzE1NDI3MywidiI6MCwiZCI6eyJ1aWQiOiJnb29nbGU6MTAyNjY0OTg5NzQzNDg1OTE2NDQ0IiwicHJvdmlkZXIiOiJnb29nbGUifX0.ANWWaHrOQss1r2Wck1w9pVM-U37VdyCFg0W4eZ12ecY')
           
             },
             mostrarEjecutivo: function(email,token){
            //$http.get('https://external-api-test.herokuapp.com/ejecutivo/treynolds7@toplist.cz/E0neqH6xQVvobVcNLWBvnbac3yVA4bbf1gXqA5U9');
                var data = {
                        _id: "5729768f3fdca6fc11e85923",
                        id_ejecutivo: "BBVACEO",
                        nombre: "Francisco Rodriguez",
                        foto: "http://financialred.com/wp-content/uploads/2013/11/Francisco_Gonzalez.jpg",
                        tipo_doc: "cc",
                        documento: 1040215478,
                        correo: "frodriguez@bbva.com",
                        celular: 3128563215,
                        ubicacion: {
                            longitud: 6.173388,
                            latitud: -75.591214
                            }
                        };
                        return data;
             }

             
        }

    });
