(function () {
    'use strict';

    var POLLING_DELAY = 5000,
        HISTORY_LIMIT = 50;

    function DexController($scope, $interval, applicationContext, assetStoreFactory, datafeedApiService,
                           dexOrderService, dexOrderbookService, notificationService, utilsService, dialogService) {

        var ctrl = this,
            intervalPromise,

            assetStore = assetStoreFactory.createStore(applicationContext.account.address),

            sender = {
                publicKey: applicationContext.account.keyPair.public,
                privateKey: applicationContext.account.keyPair.private
            };

        ctrl.assetsList = [];

        ctrl.pair = {
            amountAsset: Currency.KDEX,
            priceAsset: Currency.SGD
        };

        emptyDataFields();

        // var favoritePairs = [
        //     // { amountAsset: Currency.KDEX, priceAsset: Currency.CKR },
        //     { amountAsset: Currency.KDEX, priceAsset: Currency.SGD },
        //     { amountAsset: Currency.KDEX, priceAsset: Currency.IKI },
        //     { amountAsset: Currency.KDEX, priceAsset: Currency.HOTX },
        //     // { amountAsset: Currency.KDEX, priceAsset: Currency.DC },
        //     { amountAsset: Currency.KDEX, priceAsset: Currency.KLTC },
        //     { amountAsset: Currency.KDEX, priceAsset: Currency.KETH },
        //     { amountAsset: Currency.KDEX, priceAsset: Currency.KBCH },
        //     { amountAsset: Currency.KDEX, priceAsset: Currency.KBTC },
        //     { amountAsset: Currency.KDEX, priceAsset: Currency.KWAVES },
        //     { amountAsset: Currency.KDEX, priceAsset: Currency.VAI },
        //     { amountAsset: Currency.KDEX, priceAsset: Currency.VEX },
        //     // break
        //     { amountAsset: Currency.IKI, priceAsset: Currency.KDEX }, // technically should work, but the display seems to be conky
        //     { amountAsset: Currency.IKI, priceAsset: Currency.SGD },
        //     { amountAsset: Currency.IKI, priceAsset: Currency.HOTX },
        //     { amountAsset: Currency.IKI, priceAsset: Currency.KLTC },
        //     { amountAsset: Currency.IKI, priceAsset: Currency.KETH },
        //     { amountAsset: Currency.IKI, priceAsset: Currency.KBCH },
        //     { amountAsset: Currency.IKI, priceAsset: Currency.KBTC },
        //     { amountAsset: Currency.IKI, priceAsset: Currency.KWAVES },
        //     { amountAsset: Currency.IKI, priceAsset: Currency.VAI },
        //     { amountAsset: Currency.IKI, priceAsset: Currency.VEX },   
        //     // break
        //     { amountAsset: Currency.SGD, priceAsset: Currency.KDEX },
        //     { amountAsset: Currency.SGD, priceAsset: Currency.IKI },
        //     { amountAsset: Currency.SGD, priceAsset: Currency.HOTX },
        //     { amountAsset: Currency.SGD, priceAsset: Currency.KLTC },
        //     { amountAsset: Currency.SGD, priceAsset: Currency.KETH },
        //     { amountAsset: Currency.SGD, priceAsset: Currency.KBCH },
        //     { amountAsset: Currency.SGD, priceAsset: Currency.KBTC },
        //     { amountAsset: Currency.SGD, priceAsset: Currency.KWAVES },
        //     { amountAsset: Currency.SGD, priceAsset: Currency.VAI },
        //     { amountAsset: Currency.SGD, priceAsset: Currency.VEX }, 
        //     // break
        //     { amountAsset: Currency.HOTX, priceAsset: Currency.KDEX },
        //     { amountAsset: Currency.HOTX, priceAsset: Currency.IKI },
        //     { amountAsset: Currency.HOTX, priceAsset: Currency.SGD },
        //     { amountAsset: Currency.HOTX, priceAsset: Currency.KLTC },
        //     { amountAsset: Currency.HOTX, priceAsset: Currency.KETH },
        //     { amountAsset: Currency.HOTX, priceAsset: Currency.KBCH },
        //     { amountAsset: Currency.HOTX, priceAsset: Currency.KBTC },
        //     { amountAsset: Currency.HOTX, priceAsset: Currency.KWAVES },
        //     { amountAsset: Currency.HOTX, priceAsset: Currency.VAI },
        //     { amountAsset: Currency.HOTX, priceAsset: Currency.VEX },    
        //     // copy last, replace with next asset
        //     { amountAsset: Currency.KLTC, priceAsset: Currency.KDEX },
        //     { amountAsset: Currency.KLTC, priceAsset: Currency.IKI },
        //     { amountAsset: Currency.KLTC, priceAsset: Currency.SGD },
        //     { amountAsset: Currency.KLTC, priceAsset: Currency.HOTX },
        //     { amountAsset: Currency.KLTC, priceAsset: Currency.KETH },
        //     { amountAsset: Currency.KLTC, priceAsset: Currency.KBCH },
        //     { amountAsset: Currency.KLTC, priceAsset: Currency.KBTC },
        //     { amountAsset: Currency.KLTC, priceAsset: Currency.KWAVES },
        //     { amountAsset: Currency.KLTC, priceAsset: Currency.VAI },
        //     { amountAsset: Currency.KLTC, priceAsset: Currency.VEX },        
        //     // copy last, replace with next asset
        //     { amountAsset: Currency.KETH, priceAsset: Currency.KDEX },
        //     { amountAsset: Currency.KETH, priceAsset: Currency.IKI },
        //     { amountAsset: Currency.KETH, priceAsset: Currency.SGD },
        //     { amountAsset: Currency.KETH, priceAsset: Currency.HOTX },
        //     { amountAsset: Currency.KETH, priceAsset: Currency.KLTC },
        //     { amountAsset: Currency.KETH, priceAsset: Currency.KBCH },
        //     { amountAsset: Currency.KETH, priceAsset: Currency.KBTC },
        //     { amountAsset: Currency.KETH, priceAsset: Currency.KWAVES },
        //     { amountAsset: Currency.KETH, priceAsset: Currency.VAI },
        //     { amountAsset: Currency.KETH, priceAsset: Currency.VEX },    
        //     // copy last, replace with next asset
        //     { amountAsset: Currency.KBCH, priceAsset: Currency.KDEX },
        //     { amountAsset: Currency.KBCH, priceAsset: Currency.IKI },
        //     { amountAsset: Currency.KBCH, priceAsset: Currency.SGD },
        //     { amountAsset: Currency.KBCH, priceAsset: Currency.HOTX },
        //     { amountAsset: Currency.KBCH, priceAsset: Currency.KLTC },
        //     { amountAsset: Currency.KBCH, priceAsset: Currency.KETH },
        //     { amountAsset: Currency.KBCH, priceAsset: Currency.KBTC },
        //     { amountAsset: Currency.KBCH, priceAsset: Currency.KWAVES },
        //     { amountAsset: Currency.KBCH, priceAsset: Currency.VAI },
        //     { amountAsset: Currency.KBCH, priceAsset: Currency.VEX },        
        //     // copy last, replace with next asset
        //     { amountAsset: Currency.KBTC, priceAsset: Currency.KDEX },
        //     { amountAsset: Currency.KBTC, priceAsset: Currency.IKI },
        //     { amountAsset: Currency.KBTC, priceAsset: Currency.SGD },
        //     { amountAsset: Currency.KBTC, priceAsset: Currency.HOTX },
        //     { amountAsset: Currency.KBTC, priceAsset: Currency.KLTC },
        //     { amountAsset: Currency.KBTC, priceAsset: Currency.KETH },
        //     { amountAsset: Currency.KBTC, priceAsset: Currency.KBCH },
        //     { amountAsset: Currency.KBTC, priceAsset: Currency.KWAVES },
        //     { amountAsset: Currency.KBTC, priceAsset: Currency.VAI },
        //     { amountAsset: Currency.KBTC, priceAsset: Currency.VEX },  
        //     // copy last, replace with next asset
        //     { amountAsset: Currency.KWAVES, priceAsset: Currency.KDEX },
        //     { amountAsset: Currency.KWAVES, priceAsset: Currency.IKI },
        //     { amountAsset: Currency.KWAVES, priceAsset: Currency.SGD },
        //     { amountAsset: Currency.KWAVES, priceAsset: Currency.HOTX },
        //     { amountAsset: Currency.KWAVES, priceAsset: Currency.KLTC },
        //     { amountAsset: Currency.KWAVES, priceAsset: Currency.KETH },
        //     { amountAsset: Currency.KWAVES, priceAsset: Currency.KBCH },
        //     { amountAsset: Currency.KWAVES, priceAsset: Currency.KBTC },
        //     { amountAsset: Currency.KWAVES, priceAsset: Currency.VAI },
        //     { amountAsset: Currency.KWAVES, priceAsset: Currency.VEX }, 
        //     // copy last, replace with next asset
        //     { amountAsset: Currency.VAI, priceAsset: Currency.KDEX },
        //     { amountAsset: Currency.VAI, priceAsset: Currency.IKI },
        //     { amountAsset: Currency.VAI, priceAsset: Currency.SGD },
        //     { amountAsset: Currency.VAI, priceAsset: Currency.HOTX },
        //     { amountAsset: Currency.VAI, priceAsset: Currency.KLTC },
        //     { amountAsset: Currency.VAI, priceAsset: Currency.KETH },
        //     { amountAsset: Currency.VAI, priceAsset: Currency.KBCH },
        //     { amountAsset: Currency.VAI, priceAsset: Currency.KBTC },
        //     { amountAsset: Currency.VAI, priceAsset: Currency.KWAVES },
        //     { amountAsset: Currency.VAI, priceAsset: Currency.VEX },
        //     // copy last, replace with next asset
        //     { amountAsset: Currency.VEX, priceAsset: Currency.KDEX },
        //     { amountAsset: Currency.VEX, priceAsset: Currency.IKI },
        //     { amountAsset: Currency.VEX, priceAsset: Currency.SGD },
        //     { amountAsset: Currency.VEX, priceAsset: Currency.HOTX },
        //     { amountAsset: Currency.VEX, priceAsset: Currency.KLTC },
        //     { amountAsset: Currency.VEX, priceAsset: Currency.KETH },
        //     { amountAsset: Currency.VEX, priceAsset: Currency.KBCH },
        //     { amountAsset: Currency.VEX, priceAsset: Currency.KBTC },
        //     { amountAsset: Currency.VEX, priceAsset: Currency.KWAVES },
        //     { amountAsset: Currency.VEX, priceAsset: Currency.VAI },                                              
        // ];
        var assetList = [
           Currency.KDEX,
           Currency.IKI,
           Currency.SGD,
           Currency.HOTX,
           Currency.KLTC,
           Currency.KETH,
           Currency.KBCH,
           Currency.KBTC,
           Currency.KWAVES,
           Currency.VAI,
           Currency.VEX
        ];

        var i = 0, j = 0, k = 0;

        var favoritePairs = [];
        
        for (i = 0; i < assetList.length; i++){
            for (j = 0; j < assetList.length; j++) {
                if(assetList[i] != assetList[j]) {
                    favoritePairs[k] = {amountAsset: assetList[i], priceAsset: assetList[j]};
                    k++;                             
                }                           
            }
        }

        ctrl.favoritePairs = favoritePairs;


        ctrl.createOrder = function (type, price, amount, fee, callback) {
            // TODO : add a queue for the orders which weren't yet accepted

            function emptyBadOrderFields() {
                ctrl.badOrderQuestion = '';
                ctrl.placeBadOrder = ctrl.refuseBadOrder = function () {};
            }

            var amountName = ctrl.pair.amountAsset.displayName,
                priceName = ctrl.pair.priceAsset.displayName,
                badSellOrder = (type === 'sell' && ctrl.buyOrders.length && price < ctrl.buyOrders[0].price * 0.9),
                badBuyOrder = (type === 'buy' && ctrl.sellOrders.length && price > ctrl.sellOrders[0].price * 1.1);

            if (badSellOrder || badBuyOrder) {

                ctrl.badOrderQuestion = 'Are you sure you want to ' + type + ' ' +
                    amountName + ' at price ' + price + ' ' + priceName + '?';

                ctrl.placeBadOrder = function () {
                    emptyBadOrderFields();
                    ctrl.realCreateOrder(type, price, amount, fee, callback);
                };

                ctrl.refuseBadOrder = function () {
                    emptyBadOrderFields();
                    callback();
                };

                dialogService.open('#dex-bad-order-confirmation');

            } else {
                ctrl.realCreateOrder(type, price, amount, fee, callback);
            }

        };

        ctrl.realCreateOrder = function (type, price, amount, fee, callback) {
            // TODO : add a queue for the orders which weren't yet accepted
            dexOrderService
                .addOrder(ctrl.pair, {
                    orderType: type,
                    amount: Money.fromTokens(amount, ctrl.pair.amountAsset),
                    price: OrderPrice.fromTokens(price, ctrl.pair),
                    fee: Money.fromTokens(fee, Currency.KDEX)
                }, sender)
                .then(function () {
                    refreshOrderbooks();
                    refreshUserOrders();
                    notificationService.notice('Order has been created!');
                    if (callback) {
                        callback();
                    }
                })
                .catch(function (e) {
                    var errorMessage = e.data ? e.data.message : null;
                    notificationService.error(errorMessage || 'Order has not been created!');
                    if (callback) {
                        callback();
                    }
                });
        };

        ctrl.cancelOrder = function (order) {
            // TODO : add a queue for the orders which weren't yet canceled

            // TODO : add different messages for cancel and delete actions
            dexOrderService
                .removeOrder(ctrl.pair, order, sender)
                .then(function () {
                    refreshOrderbooks();
                    refreshUserOrders();
                    notificationService.notice('Order has been canceled!');
                })
                .catch(function (e) {
                    console.log(e);
                    notificationService.error('Order could not be canceled!');
                });
        };

        ctrl.changePair = function (pair) {
            ctrl.pair = pair;
            emptyDataFields();
            refreshAll();
        };

        ctrl.fillBuyForm = fillBuyForm;

        ctrl.fillSellForm = fillSellForm;

        assetStore
            .getAll()
            .then(function (assetsList) {
                ctrl.assetsList = assetsList;
            })
            .then(function () {
                return dexOrderbookService.getOrderbook(ctrl.pair.amountAsset, ctrl.pair.priceAsset);
            })
            .then(function (orderbook) {
                ctrl.pair = {
                    // Here we just get assets by their IDs
                    amountAsset: assetStore.syncGetAsset(orderbook.pair.amountAsset),
                    priceAsset: assetStore.syncGetAsset(orderbook.pair.priceAsset)
                };

                ctrl.buyOrders = orderbook.bids;
                ctrl.sellOrders = orderbook.asks;
                refreshUserOrders();
                refreshTradeHistory();
            })
            .catch(function (e) {
                console.log(e);
            });

        // Events are from asset pickers
        $scope.$on('asset-picked', function (e, newAsset, type) {
            // Define in which widget the asset was changed
            ctrl.pair[type] = newAsset;
            emptyDataFields();
            refreshAll();
        });

        // Enable polling for orderbooks and newly created assets
        intervalPromise = $interval(function () {
            refreshAll();
        }, POLLING_DELAY);

        ctrl.$onDestroy = function () {
            $interval.cancel(intervalPromise);
        };

        function emptyDataFields() {
            ctrl.buyOrders = [];
            ctrl.sellOrders = [];
            ctrl.userOrders = [];

            ctrl.buyFormValues = {};
            ctrl.sellFormValues = {};

            ctrl.tradeHistory = [];
            ctrl.lastTradePrice = 0;

            fillBuyForm();
            fillSellForm();

            // That forces children components to react on the pair change
            ctrl.pair = _.clone(ctrl.pair);
        }

        function refreshAll() {
            refreshOrderbooks();
            refreshUserOrders();
            refreshTradeHistory();
        }

        function refreshOrderbooks() {
            if (!ctrl.pair.amountAsset || !ctrl.pair.priceAsset) {
                return;
            }

            dexOrderbookService
                .getOrderbook(ctrl.pair.amountAsset, ctrl.pair.priceAsset)
                .then(function (orderbook) {
                    ctrl.buyOrders = orderbook.bids;
                    ctrl.sellOrders = orderbook.asks;
                    return orderbook.pair;
                })
                .then(function (pair) {
                    // Placing each asset in the right widget
                    if (ctrl.pair.amountAsset.id !== pair.amountAsset && ctrl.pair.priceAsset.id !== pair.priceAsset) {
                        var temp = ctrl.pair.amountAsset;
                        ctrl.pair.amountAsset = ctrl.pair.priceAsset;
                        ctrl.pair.priceAsset = temp;
                    }
                })
                .catch(function (e) {
                    console.log(e);
                });
        }

        function refreshUserOrders() {
            if (!ctrl.pair.amountAsset || !ctrl.pair.priceAsset) {
                return;
            }

            dexOrderService
                .getOrders(ctrl.pair)
                .then(function (orders) {
                    // TODO : add here orders from pending queues
                    ctrl.userOrders = orders;
                });
        }

        function refreshTradeHistory() {
            var pair = ctrl.pair;
            if (pair) {
                if (utilsService.isTestnet()) {
                    pair = utilsService.testnetSubstitutePair(pair);
                }

                datafeedApiService
                    .getTrades(pair, HISTORY_LIMIT)
                    .then(function (response) {
                        ctrl.tradeHistory = response.map(function (trade) {
                            return {
                                timestamp: trade.timestamp,
                                type: trade.type,
                                typeTitle: trade.type === 'buy' ? 'Buy' : 'Sell',
                                price: trade.price,
                                amount: trade.amount,
                                total: trade.price * trade.amount
                            };
                        });

                        ctrl.lastTradePrice = ctrl.tradeHistory[0].price;
                    });
            }
        }

        function fillBuyForm(price, amount, total) {
            ctrl.buyFormValues = {
                price: price,
                amount: amount,
                total: total
            };
        }

        function fillSellForm(price, amount, total) {
            ctrl.sellFormValues = {
                price: price,
                amount: amount,
                total: total
            };
        }
    }

    DexController.$inject = ['$scope', '$interval', 'applicationContext', 'assetStoreFactory', 'datafeedApiService',
        'dexOrderService', 'dexOrderbookService', 'notificationService', 'utilsService', 'dialogService'];

    angular
        .module('app.dex')
        .component('wavesDex', {
            controller: DexController,
            templateUrl: 'dex/component'
        });
})();
