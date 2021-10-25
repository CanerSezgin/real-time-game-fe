import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import mockPlayerIdService from '../utils/mockPlayerIdService';

function Home({ socket }) {
  const history = useHistory();
  const playerId = mockPlayerIdService().getPlayerId();

  useEffect(() => {
    console.log('use effect on home', playerId);

    socket.on('go-to-game', (gameId) => {
      console.log('GOTOGAME', gameId);
      return history.push(`game/${gameId}`);
    });
  }, [socket]);

  const joinGame = async () => {
    console.log(socket.id);
    const url = `http://localhost:4000/api/v1/games/join`;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    };

    const { game } = await (await fetch(url, requestOptions)).json();
    console.log(game);
    history.push(`game/${game.id}`);
  };

  return (
    <div className="home">
      <h1>Welcome to My Game</h1>

      <button onClick={joinGame}>Join Game</button>
    </div>
  );
}

export default Home;
