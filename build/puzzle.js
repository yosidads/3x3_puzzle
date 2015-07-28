enchant();  // ������
 
var FPS = 30;    				// �t���[�����[�g
var MAX_ROW = 3;				// �c�̃}�X��
var MAX_COL = 3;				// ���̃}�X��
var CELL_SIZE = 80;				// �}�X�̃T�C�Y()
var MAX_TILES = 9;
var START_IMG = "start.png";
var CLEAR_IMG = "clear.png";
var PUZZLE_IMG = "zam.png";
var CLICK_SOUND = "lock4.wav";
 
window.onload = function () {
    var game = new Core(CELL_SIZE*MAX_ROW, CELL_SIZE*MAX_ROW); 		// Game�I�u�W�F�N�g�̍쐬
    game.fps = FPS;													// �t���[�����[�g�̃Z�b�g
    game.preload(START_IMG, CLEAR_IMG, PUZZLE_IMG, CLICK_SOUND);	// �摜�̓ǂݍ���
    game.onload = function () {										// �Q�[�����J�n���ꂽ���̊֐����Z�b�g
        var scene = game.rootScene;									// game.rootScene�͒����̂�scene�ɎQ�Ƃ����蓖��
        var tiles = createSprites(game);
        
        displayStartScene(game);
		shuffleTiles(tiles);
		placeTiles(tiles);
		for (var i = 0; i < MAX_TILES - 1; i++) {
        	scene.addChild(tiles[i][0]);
        }
        //tiles[0][0].x = 0;
        //tiles[0][0].y = 0;
        //scene.addChild(tiles[1][0]);
        //tiles[1][0].x = CELL_SIZE;
        //tiles[1][0].y = 0;
        //scene.addChild(tiles[2][0]);
        //tiles[2][0].x = CELL_SIZE * 2;
        //tiles[2][0].y = 0;
        /*
        alert("tiles[0][2]=" + tiles[0][2] + "; x=" + tiles[0][0].x + "; y=" + tiles[0][0].y 
        		+ "; tiles[1][2]=" + tiles[1][2] + "; x=" + tiles[1][0].x + "; y=" + tiles[1][0].y 
        		+ "; tiles[2][2]=" + tiles[2][2] + "; x=" + tiles[2][0].x + "; y=" + tiles[2][0].y 
        		+ "; tiles[3][2]=" + tiles[3][2] + "; x=" + tiles[3][0].x + "; y=" + tiles[3][0].y 
        		+ "; tiles[4][2]=" + tiles[4][2] + "; x=" + tiles[4][0].x + "; y=" + tiles[4][0].y 
        		+ "; tiles[5][2]=" + tiles[5][2] + "; x=" + tiles[5][0].x + "; y=" + tiles[5][0].y 
        		+ "; tiles[6][2]=" + tiles[6][2] + "; x=" + tiles[6][0].x + "; y=" + tiles[6][0].y 
        		+ "; tiles[7][2]=" + tiles[7][2] + "; x=" + tiles[7][0].x + "; y=" + tiles[7][0].y 
        		//+ "; tiles[8][2]=" + tiles[8][2]
        );
        */
        
    };
    game.start();
};
 
function displayStartScene(game) {
    var scene = new Scene();                                // �V�����V�[�������
	var originalImage = new Sprite(CELL_SIZE * MAX_COL, CELL_SIZE * MAX_ROW);
	originalImage.image = game.assets[PUZZLE_IMG];
	scene.addChild(originalImage);
    var startImage = new Sprite(235, 48);                   // �X�v���C�g�����
    startImage.image = game.assets[START_IMG];     			// �X�^�[�g�摜��ݒ�
    startImage.x = 0;                                      // ���ʒu����
    startImage.y = 90;                                     // �c�ʒu����
    scene.addChild(startImage);                             // �V�[���ɒǉ�
	game.pushScene(scene);
	
	originalImage.addEventListener('touchstart', function() {
		game.replaceScene(this);
	});
}

function displayClearScene(game) {
    var scene = new Scene();                                // �V�����V�[�������
    var clearImage = new Sprite(235, 48);                   // �X�v���C�g�����
    clearImage.image = game.assets[CLEAR_IMG];     			// �X�^�[�g�摜��ݒ�
    clearImage.x = 0;                                      // ���ʒu����
    clearImage.y = 90;                                     // �c�ʒu����
    scene.addChild(clearImage);                             // �V�[���ɒǉ�
	game.pushScene(scene);
}

function createSprites(game) {
	var tiles = new Array(MAX_TILES - 1);
	for (var i = 0; i < MAX_TILES - 1; i++) {
		tiles[i] = new Array(3);
		var tile = new Sprite(CELL_SIZE, CELL_SIZE);
    	tile.image = game.assets[PUZZLE_IMG];
    	tile.frame = i;
    	//var surface = new Surface(CELL_SIZE, CELL_SIZE);
    	//tile.image = surface;
    	//surface.context.strokeRect(0, 0, CELL_SIZE, CELL_SIZE);
    	tiles[i][0] = tile;					//�X���������^�C��
    	tiles[i][1] = i;					//�X���������^�C���̘A��
    	tiles[i][2] = 0;					//�X���������^�C���̌��݈ʒu�i0�ŏ������j
   
    	tile.addEventListener('touchend', function(event) {		//Tile��EventListener��ǉ�
    		var currentX = event.x;
    		var currentY = event.y;
    		var xCellLoc = Math.floor(currentX / CELL_SIZE);
    		var yCellLoc = Math.floor(currentY / CELL_SIZE);
    		
    		if (xCellLoc < MAX_COL && yCellLoc < MAX_ROW && xCellLoc >= 0 && yCellLoc >= 0) {		//Touch Move���Q�[���g����������
				var touchLoc = xCellLoc + yCellLoc * MAX_COL;
				//alert('touchLoc=' + touchLoc);
				var occupiedFlag = false;
				for (var i = 0; i < MAX_TILES - 1; i++) {		//�ړ���ɕʂ�Tile�����邩
					if (tiles[i][2] == touchLoc) {
						occupiedFlag = true;
					}
				}
				if (!occupiedFlag) {							//�ړ����Tile���Ȃ��Ȃ�Tile���ړ�
					//alert('here2');
					this.x = xCellLoc * CELL_SIZE;
					this.y = yCellLoc * CELL_SIZE;
					var sound = game.assets[CLICK_SOUND].clone();
					sound.play();
					for (var i = 0; i < MAX_TILES - 1; i++) {
						if (tiles[i][0] == this) {				//����̏����Ώۂ�Tile��Tiles����T��
							tiles[i][2] = touchLoc;
							var completionFlag = checkPuzzleCompletion(tiles);
							if (completionFlag) {
								//alert("OK1!");
								displayClearScene(game);
							}
						}
					}
				}
			}
					
    	});
    }
    return tiles;
}

function shuffleTiles(tiles) {
	var cellLocUsedFlag = Array(MAX_TILES - 1);
	for (var i = 0; i < MAX_TILES - 1; i++) {
		cellLocUsedFlag[i] = false;
	}
	for (var i = 0; i < MAX_TILES -1; i++) {
		while (true) {
			var j = Math.floor(Math.random() * MAX_TILES);
			if (!cellLocUsedFlag[j]) {
				tiles[i][2] = j;
				cellLocUsedFlag[j] = true;
				break;
			}
		}
	}
}

function placeTiles(tiles) {
	for (var i = 0; i < MAX_TILES - 1; i++) {
        tiles[i][0].x = tiles[i][2] % MAX_COL * CELL_SIZE;
        tiles[i][0].y = Math.floor(tiles[i][2] / MAX_COL) * CELL_SIZE;
	}
}

function checkPuzzleCompletion(tiles) {
	var completionFlag = true;

	for (var i = 0; i < MAX_TILES - 1; i++) {
        if (tiles[i][1] != tiles[i][2]) {
        	 completionFlag = false;
        }
	}
	return completionFlag;
}
