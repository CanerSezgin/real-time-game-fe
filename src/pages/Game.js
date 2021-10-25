import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Player from '../components/Player';
import RoundsTable from '../components/RoundsTable';
import mockPlayerIdService from '../utils/mockPlayerIdService';
import './Game.scss';

function Game({ socket }) {
  const params = useParams();
  const { gameId } = params;
  const playerId = mockPlayerIdService().getPlayerId();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [game, setGame] = useState({});

  const play = (selection) => {
    socket.emit('play-game', gameId, selection, playerId);
  };

  const getGameMessage = (game) => {
    switch (game.status) {
      case 'pending':
        return game.isVisitor
          ? 'Waiting Second Player'
          : 'Waiting Your Opponent.';

      case 'finished':
        return game.isVisitor
          ? `Game End. ${game.winner} Won`
          : `Game End. ${
              game.winner === playerId ? 'You' : 'Your Opponent'
            } Won`;

      case 'active':
        return game.isVisitor
          ? `${game.playing}'s Turn`
          : game.isYourTurn
          ? 'Your Turn'
          : "Opponent's Turn";

      default:
        break;
    }
  };

  const enhanceGame = (game) => {
    return {
      ...game,
      isVisitor: !(game?.players || []).includes(playerId),
      isYourTurn: game.playing === playerId,
    };
  };

  useEffect(() => {
    // Note that: use axios rather than fetch for cleaner requester
    fetch(`http://localhost:4000/api/v1/games/${gameId}`)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(
        ({ game }) => {
          setIsLoaded(true);
          setGame(enhanceGame(game));
        },
        (err) => {
          setIsLoaded(true);
          setError(err);
        }
      );

    socket.on('get-game', (game) => {
      setGame(enhanceGame(game));
    });

    socket.emit('join', gameId);
  }, [socket]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="game">
        <h1>Game ({gameId})</h1>
        <div className="game-status">Game Status: {game.status}</div>
        <div className="game-table-wrapper">
          <Player
            playerId={(game?.players || [])[0]}
            game={game}
            yourId={playerId}
          />

          <div className="game-table">
            <div className="current-number">{game.number}</div>
          </div>

          <Player
            playerId={(game?.players || [])[1]}
            game={game}
            yourId={playerId}
          />
        </div>

        {!game.isVisitor && (
          <div className="actions">
            <div
              className="game-button"
              onClick={game.isYourTurn ? () => play(1) : null}
            >
              Increase (+1)
            </div>
            <div
              className="game-button"
              onClick={game.isYourTurn ? () => play(0) : null}
            >
              Stay (0)
            </div>
            <div
              className="game-button"
              onClick={game.isYourTurn ? () => play(-1) : null}
            >
              Decrease (-1)
            </div>
          </div>
        )}

        <div className="message-box">{getGameMessage(game)}</div>

        <RoundsTable rounds={game.rounds} />

        <div>{JSON.stringify(game)}</div>
      </div>
    );
  }
}

export default Game;
