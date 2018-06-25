(function () {
    'use strict';

    function WalletBoxController() {
        var ctrl = this;

        var mapping = {};
        mapping[Currency.KDEX.displayName] = {
            image: 'wB-bg-KATALYST.svg',
            displayName: Currency.KDEX.displayName
        };
        // mapping[Currency.CKR.displayName] = {
        //     image: 'CKR.png',
        //     displayName: Currency.CKR.displayName
        // };
        mapping[Currency.SGD.displayName] = {
            image: 'yusof-ishak.png',
            displayName: Currency.SGD.displayName
        };
        mapping[Currency.IKI.displayName] = {
            image: 'IKI.png',
            displayName: Currency.IKI.displayName
        };
        mapping[Currency.HOTX.displayName] = {
            image: 'HOTX.png',
            displayName: Currency.HOTX.displayName
        };
        // mapping[Currency.DC.displayName] = {
        //     image: 'DC.png',
        //     displayName: Currency.DC.displayName
        mapping[Currency.KLTC.displayName] = {
            image: 'KLTC.svg',
            displayName: Currency.KLTC.displayName
        };
        mapping[Currency.KETH.displayName] = {
            image: 'KETH.svg',
            displayName: Currency.KETH.displayName
        };
        mapping[Currency.KBCH.displayName] = {
            image: 'KBCH.svg',
            displayName: Currency.KBCH.displayName
        };
        mapping[Currency.KBTC.displayName] = {
            image: 'KBTC.svg',
            displayName: Currency.KBTC.displayName
        };

        ctrl.$onChanges = function (changesObject) {
            if (changesObject.balance) {
                var balance = changesObject.balance.currentValue;
                ctrl.integerBalance = balance.formatIntegerPart();
                ctrl.fractionBalance = balance.formatFractionPart();
            }
        };
        ctrl.$onInit = function () {
            ctrl.image = mapping[ctrl.balance.currency.displayName].image;
            ctrl.displayName = mapping[ctrl.balance.currency.displayName].displayName;
        };
    }

    WalletBoxController.$inject = [];

    angular
        .module('app.wallet')
        .component('walletBox', {
            controller: WalletBoxController,
            bindings: {
                balance: '<',
                onSend: '&',
                onWithdraw: '&',
                onDeposit: '&',
                detailsAvailable: '<?'
            },
            templateUrl: 'wallet/box.component'
        });
})();
