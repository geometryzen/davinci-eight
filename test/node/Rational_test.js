'use strict';

var Rational = require('../../cjs/davinci-blade/Rational');
var assert = require('assert');
var vows = require('vows');

vows.describe('Rational').addBatch({
    'constructor': {
        'when called with (2, 3)': {
            topic: function() {
                return new Rational(2, 3);
            },
            'should return 2 for the numer property': function(expectation) {
                assert.equal(expectation.numer, 2);
            },
            'should return 3 for the denom property': function(expectation) {
                assert.equal(expectation.denom, 3);
            }
        }
    }
}).export(module);