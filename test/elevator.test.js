'use strict';

var chai           = require('chai'),
    requireFromLib = require('requirefrom')('lib'),

    Elevator       = requireFromLib('elevator'),

    expect         = chai.expect;

describe('Module Elevator', function () {
    var elevator;

    function setupExpectedVisitedFloorOrder(expectedOrder, done) {
        var visitedFloorList = [];

        elevator.on('stoppedOnFloor', function (result) {
            visitedFloorList.push(result.floor);
        });

        elevator.once('isIdle', function (result) {
            expect(visitedFloorList).to.deep.equal(expectedOrder);
            done();
        });
    }

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
        this.timeout(1000);

        setupExpectedVisitedFloorOrder([5,6,7], done);

        elevator.goToFloor(6);
        elevator.goToFloor(7);
        elevator.goToFloor(5);
    });

    it('should stop at all the floors in the correct order going downwards', function (done) {
        this.timeout(1000);

        setupExpectedVisitedFloorOrder([3,2,1], done);

        elevator.goToFloor(3);
        elevator.goToFloor(1);
        elevator.goToFloor(2);
    });

    it('should stop at all the floors in the correct order going upwards then downwards', function (done) {
        this.timeout(1000);

        setupExpectedVisitedFloorOrder([7,2,1], done);

        elevator.goToFloor(7);
        elevator.goToFloor(1);
        elevator.goToFloor(2);
    });

    it('should stop at the floor while it is travelling in the requested direction', function (done) {
        this.timeout(1000);

        setupExpectedVisitedFloorOrder([1,5,7], done);

        // First send the elevator to the bottom
        elevator.goToFloor(1);
        elevator.goToFloor(7);
        // Now while the elevator is heading upwards call it to an intermediate floor
        setTimeout(() => {
            elevator.goToFloor(5, 'up');
        }, 100);
    });

    it('should not stop at the floor while it is travelling in the opposite requested direction', function (done) {
        this.timeout(1000);

        setupExpectedVisitedFloorOrder([1,7,5], done);

        // First send the elevator to the bottom
        elevator.goToFloor(1);
        elevator.goToFloor(7);
        // Now while the elevator is heading upwards call it to an intermediate floor
        setTimeout(() => {
            elevator.goToFloor(5, 'down');
        }, 100);
    });

    it('should indicate the direction is up when it stops at the last floor going downwards', function (done) {
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

    it('should visit the lowest floor when switching direction from going down to up', function (done) {
        this.timeout(1000);

        setupExpectedVisitedFloorOrder([7,2,1,5], done);

        // We happen to be on 7th
        elevator.goToFloor(7);
        setTimeout(() => {
            // somebody wants to go down from 2nd floor
            elevator.goToFloor(2, 'down');
             // Now while the elevator is heading downwards a request from 1st and 5th floor to go up
            elevator.goToFloor(1, 'up');
            elevator.goToFloor(5, 'up');
        }, 200);
    });

    it('should visit the same floor in both directions when switching direction from going up to down', function (done) {
        var visitedFloorList = [];
        this.timeout(1000);

        setupExpectedVisitedFloorOrder([1,6,7,6], done);

        // We happen to be on 1st
        elevator.goToFloor(1);
        setTimeout(() => {
            // Two people want to go from 6th floor, one up and one down
            elevator.goToFloor(6, 'down');
            elevator.goToFloor(6, 'up');

             // Now while the elevator is heading upwards a request from 7th
            elevator.goToFloor(7, 'down');
        }, 150);
    });

});
