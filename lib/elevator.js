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
        } else if (floor < this.currentFloor) {
            this.downQueue.push(floor);
        }
        this.start();
    }

    /**
     * As we move between each floor, this is called to determine whether we should stop
     * on that floor or not.
     */
    checkFloor() {
        var currentQueue = (this.currentDirection === 'up') ? this.upQueue : this.downQueue,
            floorIndex   = currentQueue.indexOf(this.currentFloor);

        if (floorIndex !== -1) {
            // taking advantage that this is a reference to this.[up|down]Queue
            currentQueue.splice(floorIndex, 1);
            this.emit('stoppedOnFloor', {floor: this.currentFloor});
        }
        this.move();
    }

    /**
     * To avoid concurrent elevator movement (setTimeout instances in move())
     */
    start() {
        // First determine if we are already in motion, if so do nothing since
        // the queues will get processed until they are empty
        if (this.currentDirection !== null) {
            return;
        }

        this.move();
    }

    /**
     * Examines the current direction the elevator is heading, and changes direction
     * if necessary (includes stopping). Expected to be called at each floor.
     * Currently verbose by design, but certainly a good candidate for a refactor.
     */
    determineNextDirection() {
        // going up and we should continue going up
        if (this.currentDirection === 'up' && this.upQueue.length > 0) {
            this.currentDirection = 'up';
            return;
        }

        // going up, but now we should go down
        if (this.currentDirection === 'up' && this.downQueue.length > 0) {
            this.currentDirection = 'down';
            return;
        }

        // going down and we should continue going down
        if (this.currentDirection === 'down' && this.downQueue.length > 0) {
            this.currentDirection = 'down';
            return;
        }

        // going down but we should go up
        if (this.currentDirection === 'down' && this.downQueue.length > 0) {
            this.currentDirection = 'up';
            return;
        }

        // stationary, so check both queues and head in that direction (prefer up)
        if (this.currentDirection === null) {
            if (this.upQueue.length > 0) {
                this.currentDirection = 'up';
                return;
            }
            if (this.downQueue.length > 0) {
                this.currentDirection = 'down';
                return;
            }
        }

        // should go neither up or down
        this.currentDirection = null;
        this.emit('isIdle');
    }

    /**
     * Represents the movement of the elevator. A check is first made if any
     * movement is required.
     */
    move() {
        this.determineNextDirection();

        if (this.currentDirection !== null) {
            setTimeout(() => {
                if (this.currentDirection === 'up') {
                    this.currentFloor += 1;
                } else {
                    this.currentFloor -= 1;
                }
                this.checkFloor();
            }, 50);
        }
    }
}

module.exports = Elevator;
