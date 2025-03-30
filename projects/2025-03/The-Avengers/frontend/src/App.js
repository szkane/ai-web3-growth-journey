import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import GameBoard from './components/GameBoard';
import GameList from './components/GameList';
import TicTacToeABI from './contracts/TicTacToe.json';

// 合约地址，部署后需要更新
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 初始化Web3连接
  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });

      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, TicTacToeABI.abi, signer);

      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      setAccount(address);

      // 监听账户变化
      connection.on('accountsChanged', async () => {
        window.location.reload();
      });
    } catch (error) {
      console.error('连接钱包失败:', error);
      setError('连接钱包失败，请重试。');
    }
  };

  // 创建新游戏
  const createGame = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.createGame();
      await tx.wait();

      // 刷新游戏列表
      fetchGames();
      setLoading(false);
    } catch (error) {
      console.error('创建游戏失败:', error);
      setError('创建游戏失败，请重试。');
      setLoading(false);
    }
  };

  // 加入游戏
  const joinGame = async (gameId) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.joinGame(gameId);
      await tx.wait();

      // 加载游戏信息
      loadGame(gameId);
      setLoading(false);
    } catch (error) {
      console.error('加入游戏失败:', error);
      setError('加入游戏失败，请重试。');
      setLoading(false);
    }
  };

  // 进行游戏操作
  const makeMove = async (gameId, position) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.makeMove(gameId, position);
      await tx.wait();

      // 刷新游戏信息
      loadGame(gameId);
      setLoading(false);
    } catch (error) {
      console.error('下棋失败:', error);
      setError('下棋失败，请重试。');
      setLoading(false);
    }
  };

  // 获取所有游戏
  const fetchGames = async () => {
    if (!contract) return;

    try {
      const gameCount = await contract.gameCounter();
      const gameList = [];

      for (let i = 0; i < gameCount; i++) {
        const gameInfo = await contract.getGameInfo(i);
        gameList.push({
          id: i,
          player1: gameInfo.player1,
          player2: gameInfo.player2,
          state: gameInfo.state,
          result: gameInfo.result,
        });
      }

      setGames(gameList);
    } catch (error) {
      console.error('获取游戏列表失败:', error);
    }
  };

  // 加载特定游戏信息
  const loadGame = async (gameId) => {
    if (!contract) return;

    try {
      const gameInfo = await contract.getGameInfo(gameId);

      setCurrentGame({
        id: gameId,
        player1: gameInfo.player1,
        player2: gameInfo.player2,
        nextPlayer: gameInfo.nextPlayer,
        board: gameInfo.board,
        state: gameInfo.state,
        result: gameInfo.result,
      });
    } catch (error) {
      console.error('加载游戏信息失败:', error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchGames();
    }
  }, [contract]);

  return (
    <div className="app">
      <h1>Web3 井字棋</h1>

      {!account ? (
        <button onClick={connectWallet}>连接钱包</button>
      ) : (
        <>
          <p>已连接账户: {account}</p>

          {currentGame ? (
            <GameBoard
              game={currentGame}
              account={account}
              onMove={(position) => makeMove(currentGame.id, position)}
              onBack={() => setCurrentGame(null)}
            />
          ) : (
            <>
              <button onClick={createGame} disabled={loading}>
                {loading ? '处理中...' : '创建新游戏'}
              </button>

              <GameList games={games} account={account} onJoin={joinGame} onSelect={loadGame} />
            </>
          )}

          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
}

export default App;
