class Player {
    constructor(scene, x, y, texture) {
        // Set up properties
        this.scene = scene;
        this.currentHealth = 100;
        this.currentSpeed = 0;
		this.maxSpeed = 250;
        this.takenDamage = false;
        this.invunTime = 0;
        this.hull = scene.physics.add.sprite(x, y, texture);
        this.hull.body.setSize(this.hull.width - 8, this.hull.height - 8);
        this.hull.body.colideWorldBounds = true;
        this.weaponType = 1;
		
		// Properties for levels
		this.spdLvl = 0;

        // Add listeners for mobile devices
        this.scene.input.on('pointerdown', this.handlePointerDown, this);
        this.scene.input.on('pointerup', this.handlePointerUp, this);
        this.touchData = {};
    }

    update(time, delta) {
        // Update player movement
        const worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);
        this.hull.rotation = Phaser.Math.Angle.Between(this.hull.x, this.hull.y, worldPoint.x, worldPoint.y);
        this.scene.physics.velocityFromRotation(this.hull.rotation, this.currentSpeed, this.hull.body.velocity);
		
		//Check invunrability
		if (this.takenDamage == true && this.invunTime == 0) {
			this.invunTime = time;
			console.log('made invun');
		}
		if (this.invunTime > 0) {
			if (time > this.invunTime + 2000) {
				this.invunTime = 0;
				this.takenDamage = false;
				console.log('no longer invun');
			}
		}
    }

    handlePointerDown(pointer) {
        this.touchData.startX = pointer.x;
        this.touchData.startY = pointer.y;
        this.currentSpeed = this.maxSpeed;
    }

    handlePointerUp(pointer) {
        this.touchData.endX = pointer.x;
        this.touchData.endY = pointer.y;
        this.currentSpeed = 0;
        this.handleTouch();
    }

    handleTouch() {
        const distX = this.touchData.endX - this.touchData.startX;
        const distY = this.touchData.endY - this.touchData.startY;
        this.touchData = {};
    }

    enableCollision(mainLayer) {
        // Enable collision between the player and the border
        this.scene.physics.add.collider(this.hull, mainLayer);
    }
	
	// Sets the players weapon to the selected one
	// 1 = Pistol
	// 2 = Shotgun
	setType(weapon) {
		this.weaponType = weapon;
	}
	
	getType(){
		// Returns what weapon type is currently selected
		return this.weaponType;
	}
	
	setHealth(amount){
		this.currentHealth = this.currentHealth + amount;
		if (player.currentHealth > 100) {
			player.currentHealth = 100;
		}
	}
	
	setMaxSpeed(amount) {
		this.maxSpeed = this.maxSpeed + amount;
		this.spdLvl++;
		if (this.spdLvl == 10) {
			this.maxSpeed = 350
			this.spdLvl = 10
		}
	}
	
	damage(damageType) {
		if (this.takenDamage == false) {	
			if (damageType === 'melee') {
				this.currentHealth = this.currentHealth - 5;
				console.log(this.currentHealth);
				this.scene.cameras.main.shake(200,0.005);
				this.takenDamage = true;
			}
			else if (damageType === 'bullet') {
				this.currentHealth = this.currentHealth - 10;
				console.log(this.currentHealth);
				this.scene.cameras.main.shake(200,0.01);
				this.takenDamage = true;
			}
		}
	}
	
	isDestroyed() {
		// Test to see if the player is destroyed or not, when damage is taken
		if (this.currentHealth <= 0) {
			this.scene.input.off('pointerdown', this.handlePointerDown, this);
			this.scene.input.off('pointerup', this.handlePointerUp, this);
			gtag('event', 'GameEnd', {
				'event_category': 'Iteration One',
				'event_label': 'Score',
				'value': this.scene.score
			});
			return true;
		}
	}
}

// Player Powerups

class BasePowerup {
	constructor(scene, x, y, texture, player) {
		this.scene = scene;
		this.player = player;
		this.hull = this.scene.physics.add.sprite(x, y, texture);
		this.hitBox = this.scene.physics.add.sprite(x, y, 'hitbox');
        this.hitBox.body.setSize(200, 200);
        this.hitBox.setVisible(false);
		this.hull.body.collideWorldBounds = true;
		this.hull.setDepth(4);
        this.hull.on('pointerdown', this.clickPickupDown, this);
        this.check = false;
        this.scene.physics.add.overlap(this.player.hull, this.hitBox, () => {
            this.check = true;   
        }, null, this.scene)
	}
	
	clickPickupDown(pointer) {
        if (this.check == true) {
			useDrop.call(this.scene, this.hull, this.player.hull)
		}
	}
	
    collected() {
        this.hull.removeListener('pointerdown', this.clickPickupDown, this)
        this.hull.destroy();
        this.hitBox.destroy();
	}
}

class HealthPowerup extends BasePowerup {
	constructor(scene, x, y, player) {
		var texture = 'health_pickup';
		super(scene, x, y, texture, player);
		this.dropType = 'health';
		this.hull.body.setSize(this.hull.width - 16, this.hull.height - 16);
	}
	
	clickPickupDown(pointer) {
		super.clickPickupDown(pointer);
	}
	
	collected() {
		super.collected();
	}
}

class SpeedPowerup extends BasePowerup {
	constructor(scene, x, y, player) {
		var texture = 'speed_pickup';
		super(scene, x, y, texture, player);
		this.dropType = 'speed';
		this.hull.body.setSize(this.hull.width - 16, this.hull.height - 16);
	}
	
	clickPickupDown(pointer) {
		super.clickPickupDown(pointer);
	}
	
	collected() {
		super.collected();
	}
}

class ShotgunPickup extends BasePowerup {
	constructor(scene, x, y, player) {
		var texture = 'shotgun_pickup';
		super(scene, x, y, texture, player);
		this.dropType = 'weapon_shotgun';
		this.hull.body.setSize(this.hull.width - 16, this.hull.height - 16);
	}
	
	collected() {
		super.collected();
		player.setType(2);
	}
}	