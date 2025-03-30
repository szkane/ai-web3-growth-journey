// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title 井字棋游戏智能合约
 * @dev 一个简单的井字棋游戏，支持双人对战
 */
contract TicTacToe {
    // 游戏状态枚举
    enum GameState { WAITING, ACTIVE, FINISHED }
    
    // 游戏结果枚举
    enum GameResult { ONGOING, PLAYER1_WIN, PLAYER2_WIN, DRAW }
    
    // 游戏结构体
    struct Game {
        address player1;
        address player2;
        address nextPlayer;
        uint8[9] board;       // 0: empty, 1: player1, 2: player2
        GameState state;
        GameResult result;
        uint256 createdAt;
    }
    
    // 游戏ID到游戏的映射
    mapping(uint256 => Game) public games;
    
    // 当前游戏计数器
    uint256 public gameCounter;
    
    // 事件声明
    event GameCreated(uint256 gameId, address player1);
    event GameJoined(uint256 gameId, address player2);
    event MoveMade(uint256 gameId, address player, uint8 position);
    event GameFinished(uint256 gameId, GameResult result);
    
    /**
     * @dev 创建新游戏
     */
    function createGame() external returns (uint256) {
        uint256 gameId = gameCounter++;
        
        games[gameId].player1 = msg.sender;
        games[gameId].nextPlayer = msg.sender;
        games[gameId].state = GameState.WAITING;
        games[gameId].result = GameResult.ONGOING;
        games[gameId].createdAt = block.timestamp;
        
        emit GameCreated(gameId, msg.sender);
        
        return gameId;
    }
    
    /**
     * @dev 加入游戏
     * @param gameId 游戏ID
     */
    function joinGame(uint256 gameId) external {
        Game storage game = games[gameId];
        
        require(game.player1 != address(0), "游戏不存在");
        require(game.state == GameState.WAITING, "游戏不可加入");
        require(msg.sender != game.player1, "不能与自己对战");
        
        game.player2 = msg.sender;
        game.state = GameState.ACTIVE;
        
        emit GameJoined(gameId, msg.sender);
    }
    
    /**
     * @dev 进行游戏
     * @param gameId 游戏ID
     * @param position 下棋位置 (0-8)
     */
    function makeMove(uint256 gameId, uint8 position) external {
        Game storage game = games[gameId];
        
        require(game.state == GameState.ACTIVE, "游戏未激活");
        require(msg.sender == game.nextPlayer, "不是您的回合");
        require(position < 9, "位置无效");
        require(game.board[position] == 0, "位置已被占用");
        
        // 确定玩家标记
        uint8 mark = (msg.sender == game.player1) ? 1 : 2;
        
        // 更新棋盘
        game.board[position] = mark;
        
        // 检查游戏结果
        GameResult result = checkGameResult(game.board);
        
        if (result != GameResult.ONGOING) {
            game.state = GameState.FINISHED;
            game.result = result;
            emit GameFinished(gameId, result);
        } else {
            // 更换下一个玩家
            game.nextPlayer = (msg.sender == game.player1) ? game.player2 : game.player1;
        }
        
        emit MoveMade(gameId, msg.sender, position);
    }
    
    /**
     * @dev 检查游戏结果
     * @param board 游戏棋盘
     * @return 游戏结果
     */
    function checkGameResult(uint8[9] memory board) internal pure returns (GameResult) {
        // 检查行
        for (uint8 i = 0; i < 3; i++) {
            if (board[i*3] != 0 && board[i*3] == board[i*3+1] && board[i*3+1] == board[i*3+2]) {
                return board[i*3] == 1 ? GameResult.PLAYER1_WIN : GameResult.PLAYER2_WIN;
            }
        }
        
        // 检查列
        for (uint8 i = 0; i < 3; i++) {
            if (board[i] != 0 && board[i] == board[i+3] && board[i+3] == board[i+6]) {
                return board[i] == 1 ? GameResult.PLAYER1_WIN : GameResult.PLAYER2_WIN;
            }
        }
        
        // 检查对角线
        if (board[0] != 0 && board[0] == board[4] && board[4] == board[8]) {
            return board[0] == 1 ? GameResult.PLAYER1_WIN : GameResult.PLAYER2_WIN;
        }
        
        if (board[2] != 0 && board[2] == board[4] && board[4] == board[6]) {
            return board[2] == 1 ? GameResult.PLAYER1_WIN : GameResult.PLAYER2_WIN;
        }
        
        // 检查平局
        bool isDraw = true;
        for (uint8 i = 0; i < 9; i++) {
            if (board[i] == 0) {
                isDraw = false;
                break;
            }
        }
        
        if (isDraw) {
            return GameResult.DRAW;
        }
        
        // 游戏继续
        return GameResult.ONGOING;
    }
    
    /**
     * @dev 获取游戏信息
     * @param gameId 游戏ID
     */
    function getGameInfo(uint256 gameId) external view returns (
        address player1,
        address player2,
        address nextPlayer,
        uint8[9] memory board,
        GameState state,
        GameResult result
    ) {
        Game storage game = games[gameId];
        return (
            game.player1,
            game.player2,
            game.nextPlayer,
            game.board,
            game.state,
            game.result
        );
    }
} 