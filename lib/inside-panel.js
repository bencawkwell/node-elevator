'use strict';

class InsidePanel {
    constructor (elevator) {
        this.elevator = elevator;
        this.buttons = {
            1: {isLit: false},
            2: {isLit: false},
            3: {isLit: false},
            4: {isLit: false},
            5: {isLit: false},
            6: {isLit: false},
            7: {isLit: false}
        };
        elevator.on('stoppedOnFloor', (data) => {
            if (this.buttons[data.floor] !== 'undefined') {
                this.buttons[data.floor].isLit = false;
            }
        });
    }

    getButton(floor) {
        if (typeof this.buttons[floor] !== 'undefined') {
            return this.buttons[floor];
        } else {
            throw new Error('Button does not exist');
        }
    }

    isLit(floor) {
        return this.getButton(floor).isLit;
    }

    press(floor) {
        this.getButton(floor).isLit = true;
        this.elevator.goToFloor(floor);
    }
}

module.exports = InsidePanel;
