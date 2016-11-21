'use strict';

var chai           = require('chai'),
    requireFromLib = require('requirefrom')('lib'),

    Elevator       = requireFromLib('elevator'),

    expect         = chai.expect;

describe('Module Elevator', function () {
    var elevator;

    beforeEach(function () {
        elevator = new Elevator();
    })

    it('should stop at a floor', function (done) {
        this.timeout(1000);

        elevator.on('stoppedOnFloor',function (result) {
            expect(result).to.have.property('floor').and.to.equal(5);
            done();
        });

        elevator.gotToFloor(5);
    });

    it('should notify when idle', function (done) {
        this.timeout(1000);

        elevator.on('isIdle', function () {
            expect(true);
            done();
        });

        elevator.gotToFloor(5);
    });

    it('should stop at all the floors in the correct order going up', function (done) {
        var visitedFloorList = [];
        this.timeout(1000);

        elevator.on('stoppedOnFloor',function (result) {
            visitedFloorList.push(result.floor);
        });

        elevator.on('isIdle',function (result) {
            expect(visitedFloorList).to.deep.equal([5,6,7]);
            done();
        });

        elevator.gotToFloor(6);
        elevator.gotToFloor(7);
        elevator.gotToFloor(5);
    });

});
