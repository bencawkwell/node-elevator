'use strict'

const EventEmitter = require('events');

class Elevator extends EventEmitter {
    constructor () {
        super();
        this.currentDirection = null;
        this.currentFloor = 4;
        this.upQueue = [];
        this.downQueue = [];

    }

    gotToFloor(floor) {
        if (floor > this.currentFloor) {
            this.upQueue.push(floor);
            this.move('up');
        } else if (floor < this.currentFloor) {
            this.downQueue.push(floor);
            this.move('down');
        }
    }

    checkFloor(direction) {
        var currentQueue = (direction === 'up') ? this.upQueue : this.downQueue,
            floorIndex   = currentQueue.indexOf(this.currentFloor);

        if (floorIndex !== -1) {
            // taking advantage that this is a reference to this.[up|down]Queue
            currentQueue.splice(floorIndex, 1);
            this.emit('stoppedOnFloor', {floor: this.currentFloor});
        }
        this.move(direction);
    }

    move(direction) {
        var currentQueue = (direction === 'up') ? this.upQueue : this.downQueue;

        if (currentQueue.length === 0) {
            this.emit('isIdle');
        } else {
            setTimeout(() => {
                if (direction === 'up') {
                    this.currentFloor += 1;
                } else {
                    this.currentFloor -= 1;
                }
                this.checkFloor(direction);
            }, 200);
        }
    }
}




module.exports = Elevator;