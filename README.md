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

# Morning Session 26/3/19 - Finished updating pickups

Finished updating Pickups
Session livestreamed at - https://www.twitch.tv/profdambledore - view for all that went on

Pickups now
 - Have a invisible hitbox
 - This requires the player to be in the hitbox to collect the pickup
 - The player has to click on the pickup to collect it now, intead of colliding with it

Errors found
 - The player only needs to collide with the hitbox once to allow the pickup to be used
    - They can collide with the hitbox, then run away, and still be able to user the pickup
    
 # Midday Session 27/3/19 - Added Shotgun Pickup
 
 Added a new weapon - a shotgun
  - Has a 10% chance to spawn, based on a random number generator
 - Shotgun pellets have a random spread, generated on a number gen as well
    - weaponCtrl.js, line 40
 - Shotgun spawns 8 pellets on fire
 
 Class updates
  - weaponCtrl now initializes weapon bullet groups, instead of main
  - weaponCtrl now has a this.scene property, to allow for above
  - Whenever a player weapon bullet class is needed, it is now called through weaponCtrl
  
Targets
 - Add a pistol pickup, to change back to the base weapon
