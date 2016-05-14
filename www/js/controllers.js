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

/*.controller('EjecutivoController', function($scope, $rootScope, Auth, $window) {
    $scope.ejecutivos = [];
    $scope.mostrarEjecutivo = function() {
        Auth.mostrarEjecutivo($window.localStorage.email, $window.localStorage.token).then(function(data) {
          $rootScope.show();
                $scope.contact = data;
            }
          $rootScope.hide();
        }).catch(function(error) {
            $rootScope.showAlert('error',error.data.data);
        })*/

.controller('EjecutivoController', function($scope, $rootScope,$cordovaContacts,$cordovaGeolocation, Auth, $window) {
    $scope.ejecutivos = [];
    $scope.mostrarEjecutivo = function() {
         $scope.contact = Auth.mostrarEjecutivo($window.localStorage.email, $window.localStorage.token)
        console.log($scope.contact)
     }

               
    $scope.addContact = function() {

           
            /*$scope.contacto = { 
            "displayName": $scope.contact.nombre,
            
            "phoneNumbers": [
                {
                    "value": $scope.contact.celular,
                    "type": "mobile"
                }             
            ],
            "emails": [
                {
                    "value": $scope.contact.correo,
                    "type": "home"
                }
            ]};*/

            $scope.contacto = {     // We will use it to save a contact
      
            "displayName": "Gajotres",
            "name": {
                "givenName"  : "Dragan",
                "familyName" : "Gaic",
                "formatted"  : "Dragan Gaic"
            },
            "nickname": 'Gajotres',
            "phoneNumbers": [
                {
                    "value": "+385959052082",
                    "type": "mobile"
                },
                {
                    "value": "+385914600731",
                    "type": "phone"
                }               
            ],
            "emails": [
                {
                    "value": "dragan.gaic@gmail.com",
                    "type": "home"
                }
            ],
            "addresses": [
                {
                    "type": "home",
                    "formatted": "Some Address",
                    "streetAddress": "Some Address",
                    "locality":"Zagreb",
                    "region":"Zagreb",
                    "postalCode":"10000",
                    "country":"Croatia"
                }
            ],
            "ims": null,
            "organizations": [
                {
                    "type": "Company",
                    "name": "Generali",
                    "department": "IT",
                    "title":"Senior Java Developer"
                }
            ],
            "birthday": Date("08/01/1980"),
            "note": "",
            "photos": [
                {
                    "value": "https://pbs.twimg.com/profile_images/570169987914924032/pRisI2wr_400x400.jpeg"
                }
            ],
            "categories": null,
            "urls": null
        } 

            $cordovaContacts.save($scope.contacto).then(function(result) {
                console.log('Contact Saved!');
            }, function(err) {
                console.log('An error has occured while saving contact data!');
            });
        };

        $scope.mostrarMapa = function(){
             var options = {timeout: 10000, enableHighAccuracy: true};
 
              $cordovaGeolocation.getCurrentPosition(options).then(function(position){
             
                var latLng = new google.maps.LatLng(6.173388, -75.591214);
                var mapOptions = {
                  center: latLng,
                  zoom: 15,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };
             
                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                
                 var marker = new google.maps.Marker({
                    position: latLng,
                    map: $scope.map,
                    title: 'Hello World!'
                  });
              }, function(error){
                console.log("Could not get location");
              });
        };

        $scope.mostrarMapa();

    })

