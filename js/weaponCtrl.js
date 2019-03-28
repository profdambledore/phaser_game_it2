class WeaponCtrl {
	// WeaponCtrl is a seperate class, used for deciding what type of weapon the player is currently using.
	// It is a body in the level
	constructor (scene) {
		this.scene = scene;
		this.createBulletGroups();
    }
	createBulletGroups() {
		this.pistolBullets = this.scene.physics.add.group({
			defaultKey: 'playerBullet',
			maxSize: 5
		});
		
		this.shotgunBullets = this.scene.physics.add.group({
			defaultKey: 'playerPellet',
			maxSize: 16
		});
	}

	weaponTypeOne(bullet, rotation) {
		bullet.setDepth(1);
		bullet.enableBody(false);
		bullet.setActive(true);
		bullet.setVisible(true);
		bullet.body.collideWorldBounds = true;
		bullet.body.onWorldBounds = true;
		bullet.rotation = rotation;
		return;
    }
	
	// Weapon Type Two  = Shotgun
	// Spawns 8 instances of playerBullet with a random spread	
	weaponTypeTwo(bullet, rotation) {
		bullet.setDepth(1);
		bullet.enableBody(false);
		bullet.setActive(true);
		bullet.setVisible(true);
		bullet.body.collideWorldBounds = true;
		bullet.body.onWorldBounds = true;
		var hold = Phaser.Math.RadToDeg(rotation);
		var spread = Phaser.Math.Between(hold + 10, hold - 10)
		hold = Phaser.Math.DegToRad(spread)
		bullet.rotation = hold;
    }
	
	enemyLevel2(bullet, rotation) {
		bullet.setDepth(1);
		bullet.enableBody(false);
		bullet.setActive(true);
		bullet.setVisible(true);
		bullet.body.collideWorldBounds = true;
		bullet.body.onWorldBounds = true;
		bullet.rotation = rotation;
		return;
	}
}