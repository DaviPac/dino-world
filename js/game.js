const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    // ADICIONE ESTA SEÇÃO DE FÍSICA
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Sem gravidade num jogo top-down
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update // PRECISAMOS ADICIONAR A FUNÇÃO UPDATE
    }
};

// Cria uma nova instância do jogo com as configurações
const game = new Phaser.Game(config);

let player;
let cursors;

function preload() {
    // Carrega a imagem CORRETA do tileset
    this.load.image('tiles_terreno', 'assets/terreno.png');

    // Carrega os dados do NOVO mapa
    this.load.tilemapTiledJSON('mapa_mundo', 'assets/mapa.json');

    this.load.spritesheet('personagem', 'assets/personagem.png', {
        frameWidth: 32,
        frameHeight: 32
    });
}

function create() {
    // Cria o objeto do mapa
    const map = this.make.tilemap({ key: 'mapa_mundo' });

    // Adiciona o tileset.
    // ATENÇÃO: O primeiro nome mudou de novo!
    // Este nome ('topdown-tileset') vem de dentro do novo mapa.json
    const tileset = map.addTilesetImage('topdown-tileset', 'tiles_terreno');

    // Cria as camadas (layers) do mapa
    const chaoLayer = map.createLayer('Chao', tileset, 0, 0);
    const acimaLayer = map.createLayer('Acima', tileset, 0, 0);

    // Adiciona o personagem ao mundo físico
    // 400, 300 é a posição inicial (x, y) no centro da tela
    player = this.physics.add.sprite(400, 300, 'personagem');

    // Impede o jogador de sair dos limites do mundo
    player.setCollideWorldBounds(true);

    // Inicializa o controle pelas teclas direcionais
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Primeiro, zera a velocidade do jogador a cada quadro
    player.setVelocity(0);

    // Verifica qual tecla está pressionada e define a velocidade
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    }

    const mult = 15;
    if (player.x >= 30 * mult) player.x = 30 * mult;
    if (player.y >= 30 * mult) player.y = 30 * mult;
}