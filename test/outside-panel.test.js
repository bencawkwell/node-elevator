'use strict';

var chai           = require('chai'),
    EventEmitter   = require('events'),
    sinon          = require("sinon"),
    sinonChai      = require("sinon-chai"),
    requireFromLib = require('requirefrom')('lib'),

    OutsidePanel   = requireFromLib('outside-panel'),

    expect         = chai.expect;

chai.use(sinonChai);

describe('Module OutsidePanel', function () {
    var elevator,
        panel;

    class Elevator extends EventEmitter {
        goToFloor() {}
    }

    beforeEach(function () {
        elevator = new Elevator();
    });

    it('should only provide an up button if instantiated for the ground floor', function () {
        var panel = new OutsidePanel(1, elevator);

        expect(panel.isLit('up')).to.be.false;

        expect(panel.isLit('down')).to.be.null;
    });

    it('should only provide a down button if instantiated for the top floor', function () {
        var panel = new OutsidePanel(7, elevator);

        expect(panel.isLit('up')).to.be.null;

        expect(panel.isLit('down')).to.be.false;
    });

    it('should provide both buttons if instantiated anywhere between the top and bottom floors', function () {
        var panel = new OutsidePanel(5, elevator);

        expect(panel.isLit('up')).to.be.false;

        expect(panel.isLit('down')).to.be.false;
    });

    it('should light up the correct button when a button is pressed', function () {
        var panel = new OutsidePanel(5, elevator);

        panel.press('up')

        expect(panel.isLit('up')).to.be.true;

        expect(panel.isLit('down')).to.be.false;
    });

    it('should call the elevator to the current floor when a button is pressed indicating direction', function () {
        var panel = new OutsidePanel(5, elevator),
            spy   = sinon.spy(elevator, 'goToFloor');

        panel.press('up');

        expect(elevator.goToFloor).to.have.been.calledWith(5, 'up');
    });

    it('should turn off the light for a button when the elevator arrives and heading in that direction', function () {
        var panel = new OutsidePanel(2, elevator);

        panel.press('down');
        elevator.emit('stoppedOnFloor', {floor: 2, direction: 'down'});

        expect(panel.isLit('down')).to.be.false;
    });

    it('should not turn off the light for a button when the elevator arrives at a different floor', function () {
        var panel = new OutsidePanel(3, elevator);

        panel.press('down');
        elevator.emit('stoppedOnFloor', {floor: 2, direction: 'down'});

        expect(panel.isLit('down')).to.be.true;
    });

    it('should not turn off the light when the elevator arrives but is heading in another direction', function () {
        var panel = new OutsidePanel(6, elevator);

        panel.press('up');
        elevator.emit('stoppedOnFloor', {floor: 6, direction: 'down'});

        expect(panel.isLit('up')).to.be.true;
    });

});
