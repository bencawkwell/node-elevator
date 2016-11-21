'use strict';

var chai           = require('chai'),
    requireFromLib = require('requirefrom')('lib'),

    Elevator       = requireFromLib('elevator'),

    expect         = chai.expect;

describe('Module Elevator', function () {
    var elevator,
        // Not all tests set a handler so we set empty defaults to avoid an error when removing them
        stoppedOnFloorHandler = function () {},
        isIdleHandler         = function () {};

    beforeEach(function () {
        elevator = new Elevator();
    });

    afterEach(function () {
        elevator.removeListener('stoppedOnFloor', stoppedOnFloorHandler);
        elevator.removeListener('isIdle', isIdleHandler);
    })

    it('should stop at a floor', function (done) {
        this.timeout(1000);

        stoppedOnFloorHandler = function (result) {
            expect(result).to.have.property('floor').and.to.equal(5);
            done();
        };
        elevator.on('stoppedOnFloor', stoppedOnFloorHandler);

        elevator.goToFloor(5);
    });

    it('should notify when idle', function (done) {
        this.timeout(1000);

        isIdleHandler = function () {
            expect(true);
            done();
        };
        elevator.on('isIdle', isIdleHandler);

        elevator.goToFloor(5);
    });

    it('should stop at all the floors in the correct order going upwards', function (done) {
        var visitedFloorList = [];
        this.timeout(1000);

        stoppedOnFloorHandler = function (result) {
            visitedFloorList.push(result.floor);
        };
        elevator.on('stoppedOnFloor', stoppedOnFloorHandler);

        isIdleHandler = function (result) {
            expect(visitedFloorList).to.deep.equal([5,6,7]);
            done();
        };
        elevator.on('isIdle', isIdleHandler);

        elevator.goToFloor(6);
        elevator.goToFloor(7);
        elevator.goToFloor(5);
    });

    it('should stop at all the floors in the correct order going downwards', function (done) {
        var visitedFloorList = [];
        this.timeout(1000);

        elevator.on('stoppedOnFloor',function (result) {
            visitedFloorList.push(result.floor);
        });

        elevator.on('isIdle',function (result) {
            expect(visitedFloorList).to.deep.equal([3,2,1]);
            done();
        });

        elevator.goToFloor(3);
        elevator.goToFloor(1);
        elevator.goToFloor(2);
    });

    it('should stop at all the floors in the correct order going upwards then downwards', function (done) {
        var visitedFloorList = [];
        this.timeout(1000);

        elevator.on('stoppedOnFloor',function (result) {
            visitedFloorList.push(result.floor);
        });

        elevator.on('isIdle',function (result) {
            expect(visitedFloorList).to.deep.equal([7,2,1]);
            done();
        });

        elevator.goToFloor(7);
        elevator.goToFloor(1);
        elevator.goToFloor(2);
    });

    it('should stop at the floor while it is travelling in the requested direction', function (done) {
        var visitedFloorList = [];
        this.timeout(1000);

        elevator.on('stoppedOnFloor',function (result) {
            visitedFloorList.push(result.floor);
        });

        elevator.on('isIdle',function (result) {
            expect(visitedFloorList).to.deep.equal([1,5,7]);
            done();
        });

        // First send the elevator to the bottom
        elevator.goToFloor(1);
        elevator.goToFloor(7);
        // Now while the elevator is heading upwards call it to an intermediate floor
        setTimeout(() => {
            elevator.goToFloor(5);
        }, 100);
    });

});
