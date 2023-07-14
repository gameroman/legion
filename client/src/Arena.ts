
import { io } from 'socket.io-client';

export class Arena extends Phaser.Scene
{
    socket;
    HUD;
    localPlayer;
    gridCorners;

    constructor() {
        super({ key: 'Arena' });
    }

    preload ()
    {
        // this.load.image('test',  'assets/sprites/1_1.png');
        // this.load.svg('pop', 'assets/pop.svg',  { width: 24, height: 24 } );
        const frameConfig = { frameWidth: 144, frameHeight: 144};
        this.load.spritesheet('warrior_1', 'assets/sprites/1_1.png', frameConfig);
        this.load.spritesheet('warrior_2', 'assets/sprites/1_2.png', frameConfig);
        this.load.spritesheet('warrior_3', 'assets/sprites/1_3.png', frameConfig);

        // this.load.audio('click', 'assets/click_2.wav');
    }


    connectToServer() {
        // this.socket = io('http://localhost:3123');

        // this.socket.on('connect', () => {
        //     console.log('Connected to the server');
        // });
        
        // this.socket.on('disconnect', () => {
        //     console.log('Disconnected from the server');
        // }); 

        // this.socket.on('init', this.initializeGame.bind(this));

        // this.socket.on('addCity', (data) => {
        //     // console.log('addCity data received from the server');
        //     this.addCity(data.tile, data.player);
        // });
    }

    // orderRecruitTroops() {
    //     const data = {
    //         tile: {
    //             x: this.selectedTile.x,
    //             y: this.selectedTile.y,
    //         }
    //     };
    //     this.send('recruitTroops', data);
    // }

    send(channel, data) {
        if (this.socket) {
            this.socket.emit(channel, data);
        }
    }

    drawGrid() {
        const tileSize = 60;
        const gridWidth = 20;
        const gridHeight = 10;

        const totalWidth = tileSize * gridWidth;
        const totalHeight = tileSize * gridHeight;

        // const gameWidth = Number(this.sys.game.config.width);
        // const gameHeight = Number(this.sys.game.config.height);
        const gameWidth = this.scale.gameSize.width;
        const gameHeight = this.scale.gameSize.height;

        const startX = (gameWidth - totalWidth) / 2;
        const startY = (gameHeight - totalHeight) / 2;

        // Create a graphics object
        let graphics = this.add.graphics();

        // Loop over each row
        for (let y = 0; y < gridHeight; y++) {
            // In each row, loop over each column
            for (let x = 0; x < gridWidth; x++) {
                // Set the fill style to transparent
                graphics.fillStyle(0xffffff, 0);
                graphics.fillRect(startX + x * tileSize, startY + y * tileSize, tileSize, tileSize);
                
                // Set the line style to white for the border
                graphics.lineStyle(2, 0xffffff, 1);
                graphics.strokeRect(startX + x * tileSize, startY + y * tileSize, tileSize, tileSize);
            }
        }

        this.gridCorners = {
            startX: startX,
            startY: startY,
        };
    }

    createAnims() {
        const assets = ['warrior_1', 'warrior_2', 'warrior_3']
        // Loop over assets
        assets.forEach((asset) => {
            this.anims.create({
                key: `${asset}_anim`, // The name of the animation
                frames: this.anims.generateFrameNumbers(asset, { frames: [0, 1, 2] }), 
                frameRate: 5, // Number of frames per second
                repeat: -1 // Loop indefinitely
            });
        }, this);
    }

    placeCharacters() {
        const data = [
            {
                'frame': 'warrior_1',
                'x': 16,
                'y': 4,
            },
            {
                'frame': 'warrior_2',
                'x': 18,
                'y': 2,
            },
            {
                'frame': 'warrior_3',
                'x': 18,
                'y': 6,
            }
        ]
        data.forEach((character) => {
            const x = character.x * 60 + this.gridCorners.startX - 30;
            const y = character.y * 60 + this.gridCorners.startY - 10;
            const sprite = this.add.sprite(x, y, character.frame);
            sprite.play(`${character.frame}_anim`);
        }, this);
        // const sprite = this.add.sprite(120, 135, 'warrior_1');
        // sprite.play('warrior_1_anim');
    }

    create ()
    {
        this.drawGrid();
        this.createAnims();
        this.placeCharacters();
        this.connectToServer();
    }

    createHUD() {
        this.scene.launch('HUD'); 
        this.HUD = this.scene.get('HUD');
    }

    initializeGame(data) {
        this.createHUD(); 
    }

  
    update (time, delta)
    {
    }
}