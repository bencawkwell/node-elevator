'use strict';

const EventEmitter = require('events');

class Elevator extends EventEmitter {
    constructor (delayBetweenFloorsInMilliseconds = 50) {
        super();
        this.delayBetweenFloorsInMilliseconds = delayBetweenFloorsInMilliseconds;
        this.currentDirection = null;
        this.currentFloor = 4;
        this.upQueue = [];
        this.downQueue = [];
    }

    /**
     * Main public function.
     *
     * @param      {number}  floor               The floor to send the elevator, floors from 1 to 7.
     * @param      {string}  requestedDirection  Indicate which direction(up|down) is intended after
     *                                           the floor has been visited. The main purpose is to
     *                                           prevent the elevator from stopping while travelling
     *                                           in the opposite direction than one intends.
     */
    goToFloor(floor, requestedDirection = null) {
        if (this.currentDirection === null && floor === this.currentFloor) {
            return;
        }
        // Add the floor to the appropriate queue
        if (floor > this.currentFloor) {
            this.upQueue.push({floor, requestedDirection});
        } else {
            this.downQueue.push({floor, requestedDirection});
        }

        this.start();
    }

    /**
     * Extracts all the requests for the current floor from the provided queue.
     * Since there can be multiple requests to the same floor in the queue, this
     * method will potentially return multiple items since there can be more
     * than one request for the same floor.
     *
     * @param      {Array}  queue   The queue. Bear in mind it will be modified
     *                              in place.
     * @return     {Array}  List of items that were extracted.
     */
    extractCurrentFloorsFromQueue(queue) {
        var extractedItems = [];

        for (let i = queue.length - 1; i >= 0; i--) {
            if (queue[i].floor === this.currentFloor) {
                extractedItems.push(queue[i]);
                queue.splice(i, 1);
            }
        }

        return extractedItems;
    }

    /**
     * As we move between each floor, we extract any requests for that floor,
     * and then determine whether we should stop on that floor, or skip it and
     * continue to the next floor.
     */
    checkFloor() {
        var currentQueue = (this.currentDirection === 'up') ? this.upQueue : this.downQueue,
            otherQueue   = (this.currentDirection === 'up') ? this.downQueue : this.upQueue,
            queuedItems  = this.extractCurrentFloorsFromQueue(currentQueue),
            stopItem     = null,
            reQueueItem  = null;

        this.determineNextDirection();

        queuedItems.forEach((queueItem) => {
            var direction = queueItem.requestedDirection;

            if (direction === null ||
                direction === this.currentDirection ||
                this.currentDirection === null
            ) {
                stopItem = queueItem;
            } else {
                reQueueItem = queueItem;
            }
        });

        if (reQueueItem !== null) {
            // This are floors we should stop at when the elevator is travelling
            // back in the opposite direction.
            otherQueue.push(reQueueItem);
        }
        if (stopItem !== null) {
            let indicatedDirection = this.currentDirection || stopItem.requestedDirection;

            this.emit('stoppedOnFloor', {floor: this.currentFloor, direction: indicatedDirection});
            setTimeout(this.move.bind(this), this.delayBetweenFloorsInMilliseconds);
        } else {
            this.move();
        }
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

        this.determineNextDirection();
        this.move();
    }

    /**
     * Examines the current direction the elevator is heading, and changes direction
     * if necessary (includes stopping). Expected to be called at each floor.
     * Currently verbose by design, but certainly a good candidate for a refactor.
     */
    determineNextDirection() {
        // going up and we should continue going up
        if (this.currentDirection === 'up' && this.upQueue.length > 0 && this.currentFloor < 7) {
            return;
        }
        // going down and we should continue going down
        if (this.currentDirection === 'down' && this.downQueue.length > 0 && this.currentFloor > 1) {
            return;
        }

        // Check both queues and head in that direction (preferring to go up)
        if (this.upQueue.length > 0 && this.currentFloor < 7) {
            this.currentDirection = 'up';
            return;
        }
        if (this.downQueue.length > 0 && this.currentFloor > 1) {
            this.currentDirection = 'down';
            return;
        }

        // should go neither up or down
        this.currentDirection = null;
    }

    /**
     * Represents the movement of the elevator. A check is first made if any
     * movement is required.
     */
    move() {
        if (this.currentDirection !== null) {
            setTimeout(() => {
                if (this.currentDirection === 'up' && this.currentFloor < 7) {
                    this.currentFloor += 1;
                } else if (this.currentFloor > 1) {
                    this.currentFloor -= 1;
                }
                this.emit('approachingFloor');
                this.checkFloor();
            }, this.delayBetweenFloorsInMilliseconds);
        } else {
            this.emit('isIdle');
        }
    }
}

module.exports = Elevator;
