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

    isLit(direction) {
        let button = this.buttons[direction];

        if (typeof button === 'object') {
            return button.isLit;
        }

        return null;
    }

    press(direction) {
        let button = this.buttons[direction];

        if (typeof button === 'object') {
            button.isLit = true;
            this.elevator.goToFloor(this.floor, direction);
        }
    }
}

module.exports = OutsidePanel;
