'use strict';

var fs              = require('fs'),
    repl            = require('repl'),
    requireFromLib  = require('requirefrom')('lib'),

    Elevator        = requireFromLib('elevator'),
    InsidePanel     = requireFromLib('inside-panel'),
    OutsidePanel    = requireFromLib('outside-panel'),

    logFile         = fs.createWriteStream('elevator.log', { flags: 'a' }),

    elevator        = new Elevator(1000),
    insidePanel     = new InsidePanel(elevator),

    outPanel1       = new OutsidePanel(1, elevator),
    outPanel2       = new OutsidePanel(2, elevator),
    outPanel3       = new OutsidePanel(3, elevator),
    outPanel4       = new OutsidePanel(4, elevator),
    outPanel5       = new OutsidePanel(5, elevator),
    outPanel6       = new OutsidePanel(6, elevator),
    outPanel7       = new OutsidePanel(7, elevator),

    replServer      = repl.start({
        prompt: 'Elevator > '
    });

replServer.context.showFloor   = function () {
    return elevator.currentFloor;
}
replServer.context.insidePanel = insidePanel;
replServer.context.outPanel1   = outPanel1;
replServer.context.outPanel2   = outPanel2;
replServer.context.outPanel3   = outPanel3;
replServer.context.outPanel4   = outPanel4;
replServer.context.outPanel5   = outPanel5;
replServer.context.outPanel6   = outPanel6;
replServer.context.outPanel7   = outPanel7;
replServer.context.u           = 'up';
replServer.context.d           = 'down';

logFile.write('Restarted on floor: ' + elevator.currentFloor + '\n');

/**
 * Gets the outside panel lit status. It main purpose is to avoid triggering
 * Errors by querying for the buttons that do NOT exist on the 1st and 7th floor
 *
 * @param      {number}  floor      The floor
 * @param      {string}  direction  The direction
 * @return     {string}  The outside panel lit status.
 */
function getOutsidePanelLitStatus(floor, direction) {
    if (floor >= 7 && direction === 'up') {
        return '---';
    }
    if (floor <= 1 && direction === 'down') {
        return '---';
    }
    return replServer.context['outPanel' + floor].isLit(direction);
}

/**
 * As we move between floors log the one we are on currently, and the lit status
 * of the outside panel on that floor.
 */
elevator.on('approachingFloor', function () {
    var floor = elevator.currentFloor;

    logFile.write(
        ' - Current floor: ' + floor +
        ', Outside Panel light (up): ' + getOutsidePanelLitStatus(floor, 'up') +
        ', Outside Panel light (down): ' + getOutsidePanelLitStatus(floor, 'down') +
        '\n'
    );
})

/**
 * Log every time the elevator stops, and report the floor, and lit status of
 * the outside panel on that floor.
 */
elevator.on('stoppedOnFloor', function (data) {
    var floor = data.floor;

    setTimeout(() => {
        logFile.write(
            'Stopped on floor: ' + floor +
            ', Outside Panel light (up): ' + getOutsidePanelLitStatus(floor, 'up') +
            ', Outside Panel light (down): ' + getOutsidePanelLitStatus(floor, 'down') +
            '\n'
        );
    }, 10);
})