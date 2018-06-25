(function () {
    'use strict';

    var url = 'https://katalystcoin.org/katalyst-faucet';
    var display = 'Free KDEX Faucet';

    function SupportLinkController() {}

    angular
        .module('app.shared')
        .component('wavesSupportLink', {
            controller: SupportLinkController,
            template: '<a href="' + url + '" target="_blank">' + display + '</a>'
        });
})();
