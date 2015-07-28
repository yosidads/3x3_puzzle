enchant();  // 初期化
 
var FPS = 30;    				// フレームレート
var MAX_ROW = 3;				// 縦のマス数
var MAX_COL = 3;				// 横のマス数
var CELL_SIZE = 80;				// マスのサイズ()
var MAX_TILES = 9;
var START_IMG = "start.png";
var CLEAR_IMG = "clear.png";
var PUZZLE_IMG = "zam.png";
var CLICK_SOUND = "lock4.wav";
 
window.onload = function () {
    var game = new Core(CELL_SIZE*MAX_ROW, CELL_SIZE*MAX_ROW); 		// Gameオブジェクトの作成
    game.fps = FPS;													// フレームレートのセット
    game.preload(START_IMG, CLEAR_IMG, PUZZLE_IMG, CLICK_SOUND);	// 画像の読み込み
    game.onload = function () {										// ゲームが開始された時の関数をセット
        var scene = game.rootScene;									// game.rootSceneは長いのでsceneに参照を割り当て
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
    var scene = new Scene();                                // 新しいシーンを作る
	var originalImage = new Sprite(CELL_SIZE * MAX_COL, CELL_SIZE * MAX_ROW);
	originalImage.image = game.assets[PUZZLE_IMG];
	scene.addChild(originalImage);
    var startImage = new Sprite(235, 48);                   // スプライトを作る
    startImage.image = game.assets[START_IMG];     			// スタート画像を設定
    startImage.x = 0;                                      // 横位置調整
    startImage.y = 90;                                     // 縦位置調整
    scene.addChild(startImage);                             // シーンに追加
	game.pushScene(scene);
	
	originalImage.addEventListener('touchstart', function() {
		game.replaceScene(this);
	});
}

function displayClearScene(game) {
    var scene = new Scene();                                // 新しいシーンを作る
    var clearImage = new Sprite(235, 48);                   // スプライトを作る
    clearImage.image = game.assets[CLEAR_IMG];     			// スタート画像を設定
    clearImage.x = 0;                                      // 横位置調整
    clearImage.y = 90;                                     // 縦位置調整
    scene.addChild(clearImage);                             // シーンに追加
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
    	tiles[i][0] = tile;					//９分割したタイル
    	tiles[i][1] = i;					//９分割したタイルの連番
    	tiles[i][2] = 0;					//９分割したタイルの現在位置（0で初期化）
   
    	tile.addEventListener('touchend', function(event) {		//TileにEventListenerを追加
    		var currentX = event.x;
    		var currentY = event.y;
    		var xCellLoc = Math.floor(currentX / CELL_SIZE);
    		var yCellLoc = Math.floor(currentY / CELL_SIZE);
    		
    		if (xCellLoc < MAX_COL && yCellLoc < MAX_ROW && xCellLoc >= 0 && yCellLoc >= 0) {		//Touch Moveがゲーム枠内だったら
				var touchLoc = xCellLoc + yCellLoc * MAX_COL;
				//alert('touchLoc=' + touchLoc);
				var occupiedFlag = false;
				for (var i = 0; i < MAX_TILES - 1; i++) {		//移動先に別のTileがあるか
					if (tiles[i][2] == touchLoc) {
						occupiedFlag = true;
					}
				}
				if (!occupiedFlag) {							//移動先にTileがないならTileを移動
					//alert('here2');
					this.x = xCellLoc * CELL_SIZE;
					this.y = yCellLoc * CELL_SIZE;
					var sound = game.assets[CLICK_SOUND].clone();
					sound.play();
					for (var i = 0; i < MAX_TILES - 1; i++) {
						if (tiles[i][0] == this) {				//今回の処理対象のTileをTilesから探す
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
