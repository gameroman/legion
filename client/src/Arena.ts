
import { io } from 'socket.io-client';
import { Player } from './Player';
export class Arena extends Phaser.Scene
{
    socket;
    HUD;
    localPlayer;
    gridCorners;
    gridMap: Map<string, Player> = new Map<string, Player>();

    constructor() {
        super({ key: 'Arena' });
    }

    preload ()
    {
        this.load.image('bg',  '/assets/aarena_bg.png');
        // this.load.svg('pop', 'assets/pop.svg',  { width: 24, height: 24 } );
        const frameConfig = { frameWidth: 144, frameHeight: 144};
        this.load.spritesheet('warrior_1', 'assets/sprites/1_1.png', frameConfig);
        this.load.spritesheet('warrior_2', 'assets/sprites/1_2.png', frameConfig);
        this.load.spritesheet('warrior_3', 'assets/sprites/1_3.png', frameConfig);
        this.load.spritesheet('warrior_4', 'assets/sprites/1_4.png', frameConfig);
        this.load.spritesheet('mage_1', 'assets/sprites/1_5.png', frameConfig);
        this.load.spritesheet('mage_2', 'assets/sprites/1_6.png', frameConfig);

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
        const data = {
            'player': {
                'team': [
                    {
                        'frame': 'warrior_1',
                        'x': 16,
                        'y': 4,
                    },
                    {
                        'frame': 'mage_1',
                        'x': 18,
                        'y': 2,
                    },
                    {
                        'frame': 'warrior_2',
                        'x': 18,
                        'y': 6,
                    }
                ]
            },
            'opponent': {
                'team': [
                    {
                        'frame': 'warrior_3',
                        'x': 3,
                        'y': 4,
                    },
                    {
                        'frame': 'mage_2',
                        'x': 1,
                        'y': 2,
                    },
                    {
                        'frame': 'warrior_4',
                        'x': 1,
                        'y': 6,
                    }
                ]
            }
        }
        this.initializeGame(data);

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
        const gridHeight = 9;

        const totalWidth = tileSize * gridWidth;
        const totalHeight = tileSize * gridHeight;

        // const gameWidth = Number(this.sys.game.config.width);
        // const gameHeight = Number(this.sys.game.config.height);
        const gameWidth = this.scale.gameSize.width;
        const gameHeight = this.scale.gameSize.height;

        const startX = (gameWidth - totalWidth) / 2;
        const startY = (gameHeight - totalHeight) / 2 + 150;

        // Create a graphics object
        let graphics = this.add.graphics().setDepth(2).setAlpha(0.5);

        function isSkip(x, y) {
            const v = 3;
            const skip = y < gridHeight/2 ? Math.max(0, v - y - 1) : Math.max(0, y - (gridHeight - v));
            // Skip drawing the corners to create an oval shape
            return (x < skip || x >= gridWidth - skip);
        }

        // Loop over each row
        for (let y = 0; y < gridHeight; y++) {
            // In each row, loop over each column
            for (let x = 0; x < gridWidth; x++) {
                
                if (isSkip(x, y)) continue;
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

         // Create a separate graphics object for the highlight
         let highlightGraphics = this.add.graphics().setDepth(1);

         // Add a pointer move handler to highlight the hovered tile
         this.input.on('pointermove', function (pointer) {
             let pointerX = pointer.x - startX;
             let pointerY = pointer.y - startY;
 
             // Calculate the grid coordinates of the pointer
             let gridX = Math.floor(pointerX / tileSize);
             let gridY = Math.floor(pointerY / tileSize);
 
             // Ensure the pointer is within the grid
             if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
                 // Clear the previous highlight
                 highlightGraphics.clear();

                 if (isSkip(gridX, gridY)) return;
 
                 // Draw a new highlight over the hovered tile
                 highlightGraphics.fillStyle(0xffffff, 0.3); // Semi-transparent white
                 highlightGraphics.fillRect(startX + gridX * tileSize, startY + gridY * tileSize, tileSize, tileSize);
             } else {
                 // Clear the highlight if the pointer is outside the grid
                 highlightGraphics.clear();
             }
         }, this);

         // Add a pointer down handler to print the clicked tile coordinates
        this.input.on('pointerdown', function (pointer) {
            let pointerX = pointer.x - startX;
            let pointerY = pointer.y - startY;

            // Calculate the grid coordinates of the pointer
            let gridX = Math.floor(pointerX / tileSize);
            let gridY = Math.floor(pointerY / tileSize);

            if (isSkip(gridX, gridY)) return;

            // Ensure the pointer is within the grid
            if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
                console.log(`Clicked tile at grid coordinates (${gridX}, ${gridY})`);
            }
        }, this);

        const bg = this.add.image(0, -230, 'bg').setOrigin(0, 0);

        let scaleX = gameWidth / bg.width;
        let scaleY = gameHeight / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setAlpha(0.7);
    }

    createAnims() {
        const assets = ['warrior_1', 'warrior_2', 'warrior_3', 'warrior_4', 'mage_1', 'mage_2']
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

    placeCharacters(data, isPlayer) {
        data.forEach((character, i) => {
            const x = character.x * 60 + this.gridCorners.startX + 30;
            const y = character.y * 60 + this.gridCorners.startY - 10;

            const player = new Player(this, x, y, i + 1, character.frame, isPlayer);
            this.gridMap[this.serializeCoords(character.x, character.y)] = player;
        }, this);
    }

    serializeCoords(x, y) {
        return `${x},${y}`;
    }

    create ()
    {
        this.drawGrid();
        this.createAnims();
        this.connectToServer();
    }

    createHUD() {
        this.scene.launch('HUD'); 
        this.HUD = this.scene.get('HUD');
    }

    initializeGame(data) {
        this.createHUD(); 
        this.placeCharacters(data.player.team, true);
        this.placeCharacters(data.opponent.team, false);
    }

  
    update (time, delta)
    {
    }
}