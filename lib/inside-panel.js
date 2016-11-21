'use strict'

class InsidePanel {
    constructor (elevator) {
        this.elevator = elevator;
        this.buttons = {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false
        };
        elevator.on('stoppedOnFloor', (data) => {
            this.buttons[data.floor] = false;
        });
    }

    isLit(floor) {
        return this.buttons[floor];
    }

    press(floor) {
        this.buttons[floor] = true;
        this.elevator.goToFloor(floor);
    }
}

module.exports = InsidePanel;
