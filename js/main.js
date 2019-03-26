var config = {
    type: Phaser.AUTO,
    width: 1152,
    height: 1152,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
gtag('event', 'GameStart', {
		'event_category': 'Iteration One',
		'event_label': 'Game',
		'value': "Started"
	});

// Global Important Variables
var player, bullets, weaponCtrl;
var drops = [];
var enemies = [];
var target;
var round = 1;
var score = 0;
var updated = false;


function preload() {
    // Load Tileset
    this.load.image('backTileset', 'assets/background.png')
    this.load.tilemapTiledJSON('backTilemap', 'assets/tileset.json')

    // Load Image Assets - Player
    this.load.image('player', 'assets/player.png')
    this.load.image('playerBullet', 'assets/playerBullet.png')
	this.load.image('hitbox', 'assets/hitbox.png');
	this.load.image('health_pickup', 'assets/health.png')
	this.load.image('speed_pickup', 'assets/speedBoost.png');
	this.load.image('shotgun_pickup', 'assets/shotgun.png');

    // Load Image Assets - Enemy
	// Level 1
    this.load.image('enemy1', 'assets/enemy1.png')
	
	// Level 2
	this.load.image('enemy2', 'assets/enemy2.png')
	this.load.image('enemy2Bullet', 'assets/enemy2Bullet.png');
}

function create() {
	// Create weaponCtrl
	weaponCtrl = new WeaponCtrl();
	
    // Create Map from JSON
    this.map = this.make.tilemap({ key: 'backTilemap' });
    var tileset = this.map.addTilesetImage('background', 'backTileset')

    // Create Layers from Tiled information
    this.map.createStaticLayer('botGlowLayer', tileset, 0, 0);
    var mainLayer = this.map.createStaticLayer('midGlowLayer', tileset, 0, 0);
    this.map.createStaticLayer('topGlowLayer', tileset, 0, 0);

    // Add collision to the main layer
    mainLayer.setCollisionByProperty({ collide: true });

    // Set max bounds for camera and player movement
    this.cameras.main.setBounds(0, 0, 1152, 1152);
    this.physics.world.setBounds(0, 0, 1152, 1152);

    // Create the player object
    player = new Player(this, game.config.width * 0.3, game.config.height * 0.5, 'player')
    player.enableCollision(mainLayer);
    //this.cameras.main.startFollow(player.hull, true, 0.5, 0.5);

    // Create base bullet group for the player
    pistolBullets = this.physics.add.group({
        defaultKey: 'playerBullet',
        maxSize: 5
    });
    this.input.on('pointerdown', tryShoot, this);

    this.physics.world.on('worldbounds', function (body) {
        killBullet(body.gameObject);
    }, this);

    createEnemy.call(this, 0, player, this.map);
	
	this.roundText = this.add.text(0, 0, 'Round = ' + round, {fontFamily: "Courier New"});
	this.roundText.setFontSize(60);
	
	this.scoreText = this.add.text(750, 0, 'Score = ' + score, {fontFamily: "Courier New"});
	this.scoreText.setFontSize(60);
	
	this.healthText = this.add.text(0, 1092, 'Health = ' + player.currentHealth, {fontFamily: "Courier New"});
	this.healthText.setFontSize(60);
	
	this.levelText = this.add.text(750, 1092, 'SPD = ' + player.spdLvl, {fontFamily: "Courier New"});
	this.levelText.setFontSize(60);
}

function update(time, delta) {
    // Allow the player class to update
    player.update(time, delta);
	this.scoreText.setText('Score = ' + score);
	this.healthText.setText('Health = ' + player.currentHealth);
	
	// Set Speed Text
	// Google Analytics Tracking
	if (player.spdLvl == 10 && updated == false) {
		gtag('event', 'HitMaxSpeed', {
			'event_category': 'Iteration One',
			'event_label': 'Time',
			'value': time
		});
		this.levelText.setText('SPD = MAX');
		updated = true;
	}
	else {
		this.levelText.setText('SPD = ' + player.spdLvl);
	}

    // Allow any enemies in the array to update
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update(time, delta);
    }

    if (enemies.length < 1) {
        round++;
        createEnemy.call(this, 0, player, this.map);
		this.roundText.setText('Round = ' + round);
    }
	
	// Add tap listeners to all pickups in the array, based on how close they are
	for (var i = 0; i < drops.length; i++) {
		}
}

function createEnemy(level, player, map) {
	// Choose which spawn to choose the enemy at
	var randSpawn = Math.floor(Math.random() * Math.floor(4));
	var enemySpawn = map.findObject("spawn", function (object)
		{
			if (object.id === (randSpawn + 9)) {
				return object;
			}
		});
	switch (level) {
        case 0:
            enemy = new Level0Enemy(this, 576, 576, player);
            enemies.push(enemy);
            this.physics.add.overlap(player.hull, enemy.hull, meleeDamage, null, this);
            console.log(this);
            break;
		
		case 1:
			enemy = new Level1Enemy(this, enemySpawn.x, enemySpawn.y, player);
			enemies.push(enemy);
			this.physics.add.overlap(player.hull, enemy.hull, meleeDamage, null, this);
			break;
	
			
		case 2:
			enemy = new Level2Enemy(this, enemySpawn.x, enemySpawn.y, player);
			enemies.push(enemy);
			this.physics.add.overlap(player.hull, enemy.hull, meleeDamage, null, this);
			break;
	}
}	

function createRound(player, map) {
	gtag('event', 'RoundStart', {
		'event_category': 'Iteration One',
		'event_label': 'Rounds',
		'value': round
	});
    var totalSpawn = (Math.floor(round * 1.5)) + 5;
	gtag('event', 'AmountEnemies', {
		'event_category': 'Iteration One',
		'event_label': 'Enemies',
		'value': totalSpawn
	});
    console.log("Round Enemies = " + totalSpawn)
    for (var i = 0; i < totalSpawn; i++) {
        var randLevel = Phaser.Math.Between(1, 2);
        createEnemy.call(this, randLevel, player, map);

        // Add colliders to each enemy already in the array
        if (i > 0) {
            for (var j = 0; j < enemies.length - 1; j++) {
                this.physics.add.collider(enemy.hull, enemies[j].hull);
            }
        }
    }

}

function tryShoot(pointer) {
    var type = player.getType();
    if (type == 1) {
        var bullet = pistolBullets.get(player.hull.x, player.hull.y);
        if (bullet) {
            fireBullet.call(this, bullet, player.hull.rotation, enemies);
        }
    }
    else if (type == 2) {
        var bullet = shotgunBullets.get(player.hull.x, player.hull.y);
        if (bullet) {
            fireBullet.call(this, bullet, player.hull.rotation, enemies);
        }
    }
}

function fireBullet(bullet, rotation, target) {
	if (target != player) {
		var type = player.getType();
        if (type === 1) {
            weaponCtrl.weaponTypeOne(bullet, rotation);
            this.physics.velocityFromRotation(bullet.rotation, 500, bullet.body.velocity);
        }
        else if (type === 2) {
            for (var j = 0; j < 8; j++) {
                weaponCtrl.weaponTypeTwo(bullet, rotation);
                this.physics.velocityFromRotation(bullet.rotation, 200, bullet.body.velocity);
            }
        }
    }
	else {
		weaponCtrl.enemyLevel2(bullet, rotation);
		this.physics.velocityFromRotation(bullet.rotation, 500, bullet.body.velocity);
	}

    if (target === player) {
        this.physics.add.overlap(player.hull, bullet, bulletHitPlayer, null, this);
    }
    else {
        for (var i = 0; i < enemies.length; i++) {
            this.physics.add.overlap(enemies[i].hull, bullet, bulletHitEnemy, null, this);
        }
    }
}

function killBullet(bullet) {
    bullet.disableBody(true, true);
    bullet.setActive(false);
    bullet.setVisible(false);
}

function bulletHitPlayer(hull, bullet) {
	killBullet(bullet);
	var damageType = 'bullet'
	player.damage(damageType)
	if (player.isDestroyed() == true) {
		this.physics.pause();
		console.log("You Lose");
	}
}

function bulletHitEnemy(hull, bullet) {
    var enemy;
    var index;
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].hull === hull) {
            enemy = enemies[i];
            index = i;
            break;
        }
    }
    killBullet(bullet);
    enemy.damage();

    if (enemy.alive == false) {
        if (enemies[i].level == 0) {
            createRound.call(this, player, this.map)
			score = score - 1;
        }
		createDrop.call(this, enemy.level, enemy.hull.x, enemy.hull.y)
        enemies.splice(index, 1);
		score = score + 1;
    }
}

function meleeDamage() {
	// If a tank overlaps with the player, this functionis called
	var damageType = 'melee';
	player.damage(damageType);
	if (player.isDestroyed() == true) {
		this.physics.pause();
		console.log("You Lose");
	}
}

function createDrop(level, locX, locY) {
	var spawnChance = Phaser.Math.Between(0, 100);
	if (level == 0) {
		return;
	}
	else {
        if (spawnChance <= 10) {
			speedDrop = new SpeedPowerup(this, locX, locY, player);
			speedDrop.hull.setInteractive();
            drops.push(speedDrop);
		}
        else if (spawnChance >= 95) {
			healthDrop = new HealthPowerup(this, locX, locY, player);
			healthDrop.hull.setInteractive();
            drops.push(healthDrop);
		}
	}
}

function useDrop(hull, playerHull) {
	var drop;
	var index;
	for (var i = 0; i < drops.length; i++) {
        if (drops[i].hull === hull) {
            drop = drops[i];
            index = i;
            break;
        }
    }
	if (drop.dropType == 'speed') {	
		player.setMaxSpeed(10);
		drop.collected();
		drops.splice(index, 1);
	}
	else if (drop.dropType == 'health') {	
		player.setHealth(20);
		drop.collected();
		drops.splice(index, 1);
	}
}