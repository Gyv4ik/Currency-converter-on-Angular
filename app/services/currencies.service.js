(function() {
    'use strict';

    angular
        .module('app')
        .factory('currencies', currencies);

    currencies.$inject = ['$http'];

    /* @ngInject */
    function currencies($http) {
        var curList;
        var currencies = {
            init: init,
            getCurrencies: getCurrencies,
            getCurrenciesNames: getCurrenciesNames,
            getCurrenciesRates: getCurrenciesRates,
            getBase: getBase
        };
        return currencies;

        ////////////////

        function init() {
            var url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange';

            curList = $http.get(url);
        }

        function getCurrencies() {
            return curList;
        }

        function getCurrenciesRates() {
            return curList.then(function(currencies) {
                var ccyRates = {};

                currencies.data.forEach(function(item) {
                    ccyRates[item.base_ccy + item.ccy] = 1 / parseFloat(item.buy);
                    ccyRates[item.ccy + item.base_ccy] = parseFloat(item.sale);
                });

                return ccyRates;
            });
        }

        function getCurrenciesNames() {
            return curList.then(function(currencies) {
                var items = currencies.data;
                var names = items
                    .filter(function(item) {
                        return item.ccy !== 'BTC';
                    })
                    .map(function(item) {
                        return item.ccy;
                    });
                names.push(items[0].base_ccy);
                return names;
            });
        }

        function getBase() {
            return curList.then((data) => data.data[0].base_ccy);
        }
    }
})();
