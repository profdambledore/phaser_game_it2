# phaser_game_it2
Iteration Two of the Phaser3 Prototype Project

# Morning Session 25/3/19 - Update Pickup System

Updated pickup system
 - Can no longer only collide with pickups to collect them
 - Now have a hitbox gameObject
 - Add click event listener to all power-ups

Need to do - 
 - Add code that detects if colliding with the hitBox gameObject
 - If they are, and the pick-up is clicked, call the useDrop function
 - Remove the event listener
 - Hide the hitbox

# Evening Session 25/3/19 - Further Updates to Pickups

Updated pickup code
 - Has an additional sprite attached to pickups - hitbox
    - This hitbox is currently visible, will need to be changed to invisible
 - Added pointerdown listener to all pickups, only over pickups

created assets
 - Created new shotgun pickup asset in .psd

Need to do
 - Continue on overlap code, currently doesn't work
