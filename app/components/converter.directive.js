(function() {
    'use strict';

    angular
        .module('app')
        .directive('converter', converter);

    converter.$inject = ['currencies'];

    /* @ngInject */
    function converter(currencies) {
        var converter = {
            bindToController: true,
            controller: ConverterCtrl,
            controllerAs: 'Converter',
            link: link,
            restrict: 'E',
            scope: {
            },
            templateUrl: "components/converter.directive.html"
        };
        return converter;

        function link(scope, element, attrs) {
            scope.isValid = () => scope.ccyConverter.$invalid || scope.ccyConverter.have.$pristine || scope.ccyConverter.want.$pristine;
            scope.isUnique = isUnique;
            scope.wantHandler = wantHandler;
            scope.calculate = calculate;
            scope.result;

            function isUnique(str) {
                return str !== scope.currencies.have;
            }

            function wantHandler(ccy) {
                var currencies = scope.currencies;

                if(!currencies.want) {
                    currencies.want = findNext();
                }

                function findNext() {
                    var next;
                    var expected = scope.currencies.have;
                    var arr = scope.currencies.names;

                    arr.forEach(function(item, i) {
                        if (item === expected) next = arr[i+1];
                    });

                    return next ? next : arr[0];
                }
            }

            function calculate() {
                var have = scope.currencies.have;
                var want = scope.currencies.want;
                var baseCcy = scope.currencies.base;
                var amount = scope.currencies.amount;
                var rates = scope.currencies.rates;

                if (have !== baseCcy && want !== baseCcy) {
                     scope.result = (amount * rates[have + baseCcy] * rates[baseCcy + want]).toFixed(2);
                     return;
                }

                scope.result = (amount * rates[have + want]).toFixed(2);
            }
        }
    }

    /* @ngInject */
    function ConverterCtrl(currencies, $scope) {
        $scope.defaultText = 'Select currency';
        $scope.currencies = {
            have: $scope.defaultText,
            want: $scope.defaultText,
            amount: 0,
            base: null,
            names: null,
            rates: null
        };

        init();

        function init() {
            currencies.getCurrenciesNames().then(data => ($scope.currencies.names = data)); // ?
            currencies.getCurrenciesRates().then(data => ($scope.currencies.rates = data)); // ?
            currencies.getBase().then(function(data) {
                $scope.currencies.base = data;
            });
        }
    }
})();
