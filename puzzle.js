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
    		var touchLoc;
    		var targetTileSeq;
    		var originalLoc;
			var occupiedFlag = false;
			var movableFlag = false;
			    		
    		if (xCellLoc < MAX_COL && yCellLoc < MAX_ROW && xCellLoc >= 0 && yCellLoc >= 0) {		//Touch Move���Q�[���g����������
				touchLoc = xCellLoc + yCellLoc * MAX_COL;
				//alert('touchLoc=' + touchLoc);
				for (var i = 0; i < MAX_TILES - 1; i++) {		//�ړ���ɕʂ�Tile�����邩
					if (tiles[i][2] == touchLoc) {
						occupiedFlag = true;
					}
				}
				if (!occupiedFlag) {							//�ړ����Tile���Ȃ��Ȃ�Tile�ړ����\���ǂ�������
					for (var i = 0; i < MAX_TILES - 1; i++) {
						if (tiles[i][0] == this) {				//����̏����Ώۂ�Tile��Tiles����T��
							targetTileSeq = i;
							originalLoc = tiles[targetTileSeq][2];
							//alert(originalLoc % MAX_COL);
							switch (originalLoc % MAX_COL) {	//Tile�̏ꏊ�i��ʒu�j�ŏ����𕪂���
								case 0:							//���݂�Tile�����[�Ȃ�㉺���E�ׂɈړ��\
									if ((Math.abs(originalLoc - touchLoc) == MAX_COL) || 
											((originalLoc - touchLoc) == -1)) {				
										movableFlag = true;
										break;
									}
								case MAX_COL - 1:				//���݂�Tile���E�[�Ȃ�㉺�����ׂɈړ��\
									if ((Math.abs(originalLoc - touchLoc) == MAX_COL) || 
											((originalLoc - touchLoc) == 1)) {
										movableFlag = true;
										break;
									}
								default:						//���݂�Tile���[�łȂ��Ȃ�㉺���E�Ɉړ��\
									if ((Math.abs(originalLoc - touchLoc) == MAX_COL) ||
											(Math.abs(originalLoc - touchLoc) == 1)) {
										movableFlag = true;
										break;
									}
							}
							
						}
					}
					if (movableFlag) {							//Tile�ړ����\�������ꍇ
						this.x = xCellLoc * CELL_SIZE;
						this.y = yCellLoc * CELL_SIZE;
						var sound = game.assets[CLICK_SOUND].clone();
						sound.play();
						tiles[targetTileSeq][2] = touchLoc;
						var completionFlag = checkPuzzleCompletion(tiles);
						if (completionFlag) {
							//alert("OK1!");
							displayClearScene(game);
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
