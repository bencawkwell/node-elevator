# Elevator Test Cases

A list of test cases that can be executed to verify the elevator behaves to
requirements.

## Basic Set

Scenario: Take elevator to 6th floor
```
  Given the elevator is on floor 4
  When button 6 is pressed on the inside panel
  Then the elevator should travel to floor 6
```

```javascript
insidePanel.press(6)
```

Scenario: Call the elevator to 1st floor
```
  Given the elevator is on floor 6
  When button 'up' is pressed on the outside panel on floor 1
  Then the elevator should travel to floor 1
```

```javascript
outPanel1.press(u)
```

Scenario: Request to go up while elevator is travelling upwards
```
  Given the elevator is on floor 1 and is travelling to floor 7
  When button 'up' is pressed on the outside panel on floor 3
  Then the elevator should stop at floor 3 and then travel to floor 7
```

```javascript
insidePanel.press(7); outPanel3.press(u)
```

Scenario: Request to go up while elevator is travelling downwards
```
  Given the elevator is on floor 7 and is travelling to floor 2
  When button 'up' is pressed on the outside panel on floor 4
  Then the elevator should continue to floor 2 and then travel to floor 4
```

```javascript
insidePanel.press(2); outPanel4.press(u)
```

## Some corner cases

Scenario: Request to go the current floor
```
  Given the elevator is on floor 4
  When button 4 is pressed on the inside panel
  Then the elevator should do nothing
```

```javascript
insidePanel.press(4)
```

Scenario: Request to go up and down from the same floor
```
  Given the elevator is on floor 4 and is travelling to floor 7
  When button 'up' and 'down' are pressed on the outside panel on floor 5
  Then the elevator should stop at floor 5 then stop at floor 7
  and travel back down to floor 5
```

```javascript
insidePanel.press(7); outPanel5.press(d); outPanel5.press(u)
```

Scenario: Request to go down from a floor the elevator has just passed
```
  Given the elevator is travelling to floor 1 and has passed floor 4
  When button 'down' is pressed on the outside panel on floor 4
  Then the elevator should continue to floor 1 then travel back up to floor 4
```

```javascript
insidePanel.press(1); setTimeout(() => {outPanel4.press(d)}, 2500)
```

Scenario: Request to go down from a floor above where the elevator will stop
in that direction
```
  Given the elevator is travelling to floor 6
  When button 'down' is pressed on the outside panel on floor 5 and floor 7
  Then the elevator should stop at floor 6 then stop at floor 7 then travel back down to floor 5
```

```javascript
insidePanel.press(6); outPanel5.press(d); outPanel7.press(d)
```

