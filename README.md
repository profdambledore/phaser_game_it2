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
