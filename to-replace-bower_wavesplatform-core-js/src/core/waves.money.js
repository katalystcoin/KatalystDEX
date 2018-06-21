/******************************************************************************
 * Copyright © 2016 The KDEX Developers.                                *
 *                                                                            *
 * See the LICENSE files at                                                   *
 * the top-level directory of this distribution for the individual copyright  *
 * holder information and the developer policies on copyright and licensing.  *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * KDEX software, including this file, may be copied, modified, propagated,  *
 * or distributed except according to the terms contained in the LICENSE      *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

/**
 * @requires {decimal.js}
 */

var Currency = (function () {
    var currencyCache = {};

    function Currency(data) {
        data = data || {};

        this.id = data.id; // base58 encoded asset id of the currency
        this.displayName = data.displayName;
        this.shortName = data.shortName || data.displayName;
        this.precision = data.precision; // number of decimal places after a decimal point
        this.verified = data.verified || false;

        if (data.roundingMode !== undefined) {
            this.roundingMode = data.roundingMode;
        } else {
            this.roundingMode = Decimal.ROUND_HALF_UP;
        }

        return this;
    }

    Currency.prototype.toString = function () {
        if (this.shortName)
            return this.shortName;

        return this.displayName;
    };

    var KDEX = new Currency({
        id: '',
        displayName: 'KatalystDEX',
        shortName: 'KDEX',
        precision: 8,
        verified: true
    });
    var IKI = new Currency({
        id: 'J8EDLxNhnH6aKbHTmUQhq8dnnSamPWJSt3PzPoidyFMz',
        displayName: 'ikicoin',
        shortName: 'IKI',
        precision: 8,
        verified: true
    });
    var CKR = new Currency({
        id: 'JCsDSSCBpi6ot2bXmurRRsD9kADLw3rF9qxU4zp1scVy',
        displayName: 'ChickenRice',
        shortName: 'CKR',
        precision: 2,
        verified: true
    });
    var SGD = new Currency({
        id: '6wSooBUa4CUdha5EjzoUGsnj78PqhTDzL44qe37pi4ff',
        displayName: 'kSGD',
        shortName: 'SGD',
        precision: 2,
        verified: true
    });
    var HOTX = new Currency({
        id: '2YqDopXNUFfqyLCEy1gHJYxLqsExAQjpk1BjPJ4QebMB',
        displayName: 'HOTX',
        shortName: 'HOTX',
        precision: 8,
        verified: true
    });
    // var DC = new Currency({
    //     id: 'GQsFCrD43pHkhdvt5PnZ4W9Qgg8X9LjCSWAUG6mLoFMg',
    //     displayName: 'DionCoin',
    //     shortName: 'DC',
    //     precision: 8,
    //     verified: true
    // });
    var kBTC = new Currency({
        id: '7aqUdRkXWeEJv2MFB2Bbfh1Aw7tQvZY1C1FBBBGW5uwC',
        displayName: 'kBTC',
        shortName: 'kBTC',
        precision: 8,
        verified: true
    });
    var kBCH = new Currency({
        id: '8wW3seJ8dVG6YqNdLkGzf5MyChknRny7nTxmr4iqGouW',
        displayName: 'kBCH',
        shortName: 'kBCH',
        precision: 8,
        verified: true
    });
    var kETH = new Currency({
        id: '6Xxv6G5xAZJUtvDsenbFc7LXka3WEnVtWBajwRbwHbrz',
        displayName: 'kETH',
        shortName: 'kETH',
        precision: 8,
        verified: true
    });
    var kLTC = new Currency({
        id: 'GJD14mTYwSiFJwJjFAj2zBm5JBgYpwU6W6X1xbEK5LGV',
        displayName: 'kLTC',
        shortName: 'kLTC',
        precision: 8,
        verified: true
    });

    function invalidateCache() {
        currencyCache = {};
        currencyCache[KDEX.id] = KDEX;
        currencyCache[CKR.id] = CKR;
        currencyCache[SGD.id] = SGD;
        currencyCache[IKI.id] = IKI;
        currencyCache[HOTX.id] = HOTX;
        currencyCache[DC.id] = DC;
        currencyCache[kBTC.id] = kBTC;
        currencyCache[kBCH.id] = kBCH;
        currencyCache[kETH.id] = kETH;
        currencyCache[kLTC.id] = kLTC;
    }

    invalidateCache();

    return {
        create: function (data) {
            // if currency data.id is not set - it's a temporary instance
            if (!_.has(data, 'id')) {
                return new Currency(data);
            }

            if (!currencyCache[data.id]) {
                currencyCache[data.id] = new Currency(data);
            }

            return currencyCache[data.id];
        },
        invalidateCache: invalidateCache,
        isCached: isCached,
        KDEX: KDEX,
        CKR:CKR,
        SGD:SGD,
        IKI:IKI,
        HOTX:HOTX,
        DC:DC,
        kBTC:kBTC,
        kBCH:kBCH,
        kETH:kETH,
        kLTC:kLTC,
    };
})();

var Money = function(amount, currency) {
    var DECIMAL_SEPARATOR = '.';
    var THOUSANDS_SEPARATOR = ',';

    if (amount === undefined)
        throw Error('Amount is required');

    if (currency === undefined)
        throw Error('Currency is required');

    this.amount = new Decimal(amount)
        .toDecimalPlaces(currency.precision, Decimal.ROUND_FLOOR);
    this.currency = currency;

    var integerPart = function (value) {
        return value.trunc();
    };

    var fractionPart = function (value) {
        return value.minus(integerPart(value));
    };

    var format = function (value) {
        return value.toFixed(currency.precision, currency.roundingMode);
    };

    var validateCurrency = function (expected, actual) {
        if (expected.id !== actual.id)
            throw new Error('Currencies must be the same for operands. Expected: ' +
                expected.displayName + '; Actual: ' + actual.displayName);
    };

    var fromTokensToCoins = function (valueInTokens, currencyPrecision) {
        return valueInTokens.mul(Math.pow(10, currencyPrecision)).trunc();
    };

    var fromCoinsToTokens = function (valueInCoins, currencyPrecision) {
        return valueInCoins.trunc().div(Math.pow(10, currencyPrecision));
    };

    // in 2016 Safari doesn't support toLocaleString()
    // that's why we need this method
    var formatWithThousandsSeparator = function (formattedAmount) {
        var parts = formattedAmount.split(DECIMAL_SEPARATOR);
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);

        return parts.join(DECIMAL_SEPARATOR);
    };

    this.formatAmount = function (stripZeroes, useThousandsSeparator) {
        var result = stripZeroes ?
            this.toTokens().toFixed(this.amount.decimalPlaces()) :
            format(this.amount);

        return useThousandsSeparator ? formatWithThousandsSeparator(result) : result;
    };

    this.formatIntegerPart = function () {
        return integerPart(this.amount).toFixed(0);
    };

    this.formatFractionPart = function () {
        var valueWithLeadingZero = format(fractionPart(this.amount));

        return valueWithLeadingZero.slice(1); // stripping the leading zero
    };

    this.toTokens = function () {
        var result = fromCoinsToTokens(fromTokensToCoins(this.amount, this.currency.precision),
            this.currency.precision);

        return result.toNumber();
    };

    this.toCoins = function () {
        return fromTokensToCoins(this.amount, this.currency.precision).toNumber();
    };

    this.plus = function (money) {
        validateCurrency(this.currency, money.currency);

        return new Money(this.amount.plus(money.amount), this.currency);
    };

    this.minus = function (money) {
        validateCurrency(this.currency, money.currency);

        return new Money(this.amount.minus(money.amount), this.currency);
    };

    this.greaterThan = function (other) {
        validateCurrency(this.currency, other.currency);

        return this.amount.greaterThan(other.amount);
    };

    this.greaterThanOrEqualTo = function (other) {
        validateCurrency(this.currency, other.currency);

        return this.amount.greaterThanOrEqualTo(other.amount);
    };

    this.lessThan = function (other) {
        validateCurrency(this.currency, other.currency);

        return this.amount.lessThan(other.amount);
    };

    this.lessThanOrEqualTo = function (other) {
        validateCurrency(this.currency, other.currency);

        return this.amount.lessThanOrEqualTo(other.amount);
    };

    this.multiply = function (multiplier) {
        if (!_.isNumber(multiplier))
            throw new Error('Number is expected');

        if (isNaN(multiplier))
            throw new Error('Multiplication by NaN is not supported');

        return new Money(this.amount.mul(multiplier), this.currency);
    };

    this.toString = function () {
        return this.formatAmount(false, true) + ' ' + this.currency.toString();
    };

    return this;
};

Money.fromTokens = function (amount, currency) {
    return new Money(amount, currency);
};

Money.fromCoins = function (amount, currency) {
    currency = currency || {};
    if (currency.precision === undefined)
        throw new Error('A valid currency must be provided');

    amount = new Decimal(amount);
    amount = amount.div(Math.pow(10, currency.precision));

    return new Money(amount, currency);
};

// set up decimal to format 0.00000001 as is instead of 1e-8
Decimal.config({toExpNeg: -(Currency.KDEX.precision + 1)});

