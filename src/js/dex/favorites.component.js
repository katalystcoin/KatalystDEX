(function () {
    'use strict';

    function FavoritesController() {
        var ctrl = this;

        ctrl.onClick = function (pair) {
            ctrl.switchPair({
                amountAsset: pair.amountAsset,
                priceAsset: pair.priceAsset
            });
        };
    }

    angular
        .module('app.dex')
        .component('wavesDexFavorites', {
            controller: FavoritesController,
            bindings: {
                pairs: '<',
                switchPair: '<'
            },
            templateUrl: 'dex/favorites.component'
        });
})();

// (function () {
// /* When the user clicks on the button, 
// toggle between hiding and showing the dropdown content */
//     function myFunction() {
//         document.getElementById("myDropdown").classList.toggle("show");
//     }

//     // Close the dropdown if the user clicks outside of it
//     window.onclick = function(event) {
//       if (!event.target.matches('.dropbtn')) {

//         var dropdowns = document.getElementsByClassName("dropdown-content");
//         var i;
//         for (i = 0; i < dropdowns.length; i++) {
//           var openDropdown = dropdowns[i];
//           if (openDropdown.classList.contains('show')) {
//             openDropdown.classList.remove('show');
//           }
//         }
//       }
//     }

//     angular
//         .module('app.dex')
//         .controller('dropCtrl', ['$scope', function($scope) {
//             $scope.count = 0;
//             $scope.myFunc = function() {
//                 $scope.count++;
//             };
//     }]);
// })();


/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropFn() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

function dropFn2() {
    document.getElementById("myDropdown2").classList.toggle("show");
}

// // Close the dropdown if the user clicks outside of it
// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn2')) {

//     var dropdowns = document.getElementsByClassName("dropdown-content2");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// };