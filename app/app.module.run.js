(function() {
    'use strict';

    angular
        .module('app')
        .run(runBlock)

    runBlock.$inject = ['currencies'];

    function runBlock(currencies) {
        currencies.init();
    }
})();
