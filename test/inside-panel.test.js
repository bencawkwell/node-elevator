'use strict';

var chai           = require('chai'),
    EventEmitter   = require('events'),
    sinon          = require("sinon"),
    sinonChai      = require("sinon-chai"),
    requireFromLib = require('requirefrom')('lib'),

    InsidePanel    = requireFromLib('inside-panel'),

    expect         = chai.expect;

chai.use(sinonChai);

describe('Module InsidePanel', function () {
    var elevator,
        panel;

    class Elevator extends EventEmitter {
        goToFloor() {}
    }

    beforeEach(function () {
        elevator = new Elevator();
        panel = new InsidePanel(elevator);
    });

    it('should light up the correct floor when a button is pressed ', function () {
        panel.press(7);

        expect(panel.isLit(7)).to.be.true;
    });

    it('should call the elevator to the correct floor when a button is pressed', function () {
        var spy = sinon.spy(elevator, 'goToFloor');

        panel.press(5);

        expect(elevator.goToFloor).to.have.been.calledWith(5);
    });

    it('should turn off the light for a floor when the elevator arrives at that floor', function () {
        panel.press(1);
        elevator.emit('stoppedOnFloor', {floor: 1});

        expect(panel.isLit(1)).to.be.false;
    });

});
