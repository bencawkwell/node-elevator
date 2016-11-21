'use strict';

var chai           = require('chai'),
    requireFromLib = require('requirefrom')('lib'),

    Elevator       = requireFromLib('elevator'),

    expect         = chai.expect;

describe('Module Elevator', function () {
    var elevator;

    beforeEach(function () {
        elevator = new Elevator();
    });

    it('should stop at a floor', function (done) {
        this.timeout(1000);

        elevator.on('stoppedOnFloor', function (result) {
            expect(result).to.have.property('floor').and.to.equal(5);
            done();
        });

        elevator.goToFloor(5);
    });

    it('should stop at a floor indicating the direction it is heading', function (done) {
        this.timeout(1000);

        elevator.once('stoppedOnFloor', function (result) {
            expect(result).to.have.property('floor').and.to.equal(2);

            expect(result).to.have.property('direction').and.to.equal('down');
            done();
        });

        elevator.goToFloor(2);
        elevator.goToFloor(1);
    });

    it('should notify when idle', function (done) {
        this.timeout(1000);

        elevator.once('isIdle', function () {
            expect(true);
            done();
        });

        elevator.goToFloor(5);
    });

    it('should stop at all the floors in the correct order going upwards', function (done) {
        var visitedFloorList = [];
        this.timeout(1000);

        elevator.on('stoppedOnFloor', function (result) {
            visitedFloorList.push(result.floor);
        });

        elevator.once('isIdle', function (result) {
            expect(visitedFloorList).to.deep.equal([5,6,7]);
            done();
        });

        elevator.goToFloor(6);
        elevator.goToFloor(7);
        elevator.goToFloor(5);
    });

    it('should stop at all the floors in the correct order going downwards', function (done) {
        var visitedFloorList = [];
        this.timeout(1000);

        elevator.on('stoppedOnFloor', function (result) {
            visitedFloorList.push(result.floor);
        });

        elevator.once('isIdle', function (result) {
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

        elevator.on('stoppedOnFloor', function (result) {
            visitedFloorList.push(result.floor);
        });

        elevator.once('isIdle', function (result) {
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

        elevator.on('stoppedOnFloor', function (result) {
            visitedFloorList.push(result.floor);
        });

        elevator.once('isIdle', function (result) {
            expect(visitedFloorList).to.deep.equal([1,5,7]);
            done();
        });

        // First send the elevator to the bottom
        elevator.goToFloor(1);
        elevator.goToFloor(7);
        // Now while the elevator is heading upwards call it to an intermediate floor
        setTimeout(() => {
            elevator.goToFloor(5, 'up');
        }, 100);
    });

    it('should not stop at the floor while it is travelling in the opposite requested direction', function (done) {
        var visitedFloorList = [];
        this.timeout(1000);

        elevator.on('stoppedOnFloor', function (result) {
            visitedFloorList.push(result.floor);
        });

        elevator.once('isIdle', function (result) {
            expect(visitedFloorList).to.deep.equal([1,7,5]);
            done();
        });

        // First send the elevator to the bottom
        elevator.goToFloor(1);
        elevator.goToFloor(7);
        // Now while the elevator is heading upwards call it to an intermediate floor
        setTimeout(() => {
            elevator.goToFloor(5, 'down');
        }, 100);
    });

    it('should indicate the direction is up when it stops at the last floor going downwards', function (done) {
        var visitedFloorList = [];
        this.timeout(1000);

        elevator.once('stoppedOnFloor', function (result) {
            expect(result).to.have.property('floor').and.to.equal(2);

            expect(result).to.have.property('direction').and.to.equal('up');

            done();
        });

        // First send the elevator downward and immediately back to the top
        elevator.goToFloor(2);
        elevator.goToFloor(5);
    });

});
