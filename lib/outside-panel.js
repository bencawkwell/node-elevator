'use strict'

class OutsidePanel {
    constructor (floor, elevator) {
        this.floor = floor;
        this.elevator = elevator;
        this.buttons = {};

        // setup the buttons
        if (floor > 1) {
            this.buttons.down = {isLit: false};
        }
        if (floor < 7) {
            this.buttons.up = {isLit: false};
        }


        elevator.on('stoppedOnFloor', (data) => {
            if (data.floor === this.floor) {
                let button = this.buttons[data.direction];

                if (typeof button === 'object') {
                    button.isLit = false;
                }
            }
        });
    }

    getButton(direction) {
        if (typeof this.buttons[direction] === 'object') {
            return this.buttons[direction];
        }
        throw new Error('Button does not exist');
    }

    isLit(direction) {
        return this.getButton(direction).isLit;
    }

    press(direction) {
        this.getButton(direction).isLit = true;
        this.elevator.goToFloor(this.floor, direction);
    }
}

module.exports = OutsidePanel;
