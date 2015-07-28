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
    		var touchLoc;
    		var targetTileSeq;
    		var originalLoc;
			var occupiedFlag = false;
			var movableFlag = false;
			    		
    		if (xCellLoc < MAX_COL && yCellLoc < MAX_ROW && xCellLoc >= 0 && yCellLoc >= 0) {		//Touch Moveがゲーム枠内だったら
				touchLoc = xCellLoc + yCellLoc * MAX_COL;
				//alert('touchLoc=' + touchLoc);
				for (var i = 0; i < MAX_TILES - 1; i++) {		//移動先に別のTileがあるか
					if (tiles[i][2] == touchLoc) {
						occupiedFlag = true;
					}
				}
				if (!occupiedFlag) {							//移動先にTileがないならTile移動が可能かどうか判定
					for (var i = 0; i < MAX_TILES - 1; i++) {
						if (tiles[i][0] == this) {				//今回の処理対象のTileをTilesから探す
							targetTileSeq = i;
							originalLoc = tiles[targetTileSeq][2];
							//alert(originalLoc % MAX_COL);
							switch (originalLoc % MAX_COL) {	//Tileの場所（列位置）で処理を分ける
								case 0:							//現在のTileが左端なら上下か右隣に移動可能
									if ((Math.abs(originalLoc - touchLoc) == MAX_COL) || 
											((originalLoc - touchLoc) == -1)) {				
										movableFlag = true;
										break;
									}
								case MAX_COL - 1:				//現在のTileが右端なら上下か左隣に移動可能
									if ((Math.abs(originalLoc - touchLoc) == MAX_COL) || 
											((originalLoc - touchLoc) == 1)) {
										movableFlag = true;
										break;
									}
								default:						//現在のTileが端でないなら上下左右に移動可能
									if ((Math.abs(originalLoc - touchLoc) == MAX_COL) ||
											(Math.abs(originalLoc - touchLoc) == 1)) {
										movableFlag = true;
										break;
									}
							}
							
						}
					}
					if (movableFlag) {							//Tile移動が可能だった場合
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
