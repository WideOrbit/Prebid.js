var assert = require('chai').assert;
var prebid = require('src/prebid');
var utils = require('src/utils');
var bidmanager = require('src/bidmanager');

var adServerTargetingFixture = require('test/fixtures/ad-server-targeting.json');
var bidResponses = require('test/fixtures/bid-responses.json');
var targetingMap = require('test/fixtures/targeting-map.json');
var adUnitCode = '/19968336/header-bid-tag-0';
var targetingString = 'hb_bidder=rubicon&hb_adid=148018fe5e&hb_pb=10.00&foobar=300x250&';
var spyLogMessage = sinon.spy(utils, 'logMessage');

bidmanager.pbBidResponseByPlacement = bidResponses;

after(function () {
    utils.logMessage.restore();
});

describe('Unit: Prebid API', function () {
    describe('getAdserverTargetingForAdUnitCodeStr', function () {
        it('should return targeting info as a string', function () {
            var result = pbjs.getAdserverTargetingForAdUnitCodeStr(adUnitCode);
            assert.equal(result, targetingString, 'returns expected string of ad targeting info')
        });

        it('should log message if adunitCode param is falsey', function () {
            var result = pbjs.getAdserverTargetingForAdUnitCodeStr();
            assert.ok(spyLogMessage.calledWith('Need to call getAdserverTargetingForAdUnitCodeStr with adunitCode'), 'expected message was logged');
            assert.equal(result, undefined, 'result is undefined');
        });
    });

    describe('getAdserverTargetingForAdUnitCode', function() {
        it('should return targeting info as an object', function() {
            var result = pbjs.getAdserverTargetingForAdUnitCode(adUnitCode);
            assert.deepEqual(result, targetingMap[adUnitCode], 'returns expected targeting info object');
        });
        it('should return full targeting map object if adunitCode is falsey', function() {
            var result = pbjs.getAdserverTargetingForAdUnitCode();
            assert.deepEqual(result, targetingMap, 'the complete targeting map object is returned');
        });
    });

    describe('getBidResponses', function() {
        it('should return expected bid responses when passed an adunitCode', function() {
            var result = pbjs.getBidResponses(adUnitCode);
            assert.deepEqual(result, { bids: utils._map(bidResponses[adUnitCode].bids, function(bid) { return getCloneBid(bid); }) });
        });
        it('should return expected bid responses when not passed an adunitCode',function() {
            var result = pbjs.getBidResponses();
            assert.deepEqual(result, bidResponses);
        });
    });
});

function getCloneBid(bid) {
    var bidClone = {};
    //clone by json parse. This also gets rid of unwanted function properties
    if (bid) {
        var jsonBid = JSON.stringify(bid);
        bidClone = JSON.parse(jsonBid);

        //clean up bid clone
        delete bidClone.pbLg;
        delete bidClone.pbMg;
        delete bidClone.pbHg;
    }
    return bidClone;
}