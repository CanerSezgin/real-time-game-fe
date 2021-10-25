import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Player from '../components/Player';
import RoundsTable from '../components/RoundsTable';
import mockPlayerIdService from '../utils/mockPlayerIdService';
import mockAutoPlayService from '../utils/mockAutoPlayService';
import './Game.scss';

function Game({ socket }) {
  const params = useParams();
  const { gameId } = params;

  const playerId = mockPlayerIdService().getPlayerId();
  const isAutoPlayActive = mockAutoPlayService().isActive();

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

  const findCorrectAnswer = (number) => {
    if (Number.isInteger((number + 1) / 3)) return 1;
    if (Number.isInteger(number / 3)) return 0;
    if (Number.isInteger((number - 1) / 3)) return -1;
  };

  const playAuto = (game) => {
    const isActive = mockAutoPlayService().isActive();
    if (!isActive) return;

    if (!!game && game.number && game.isYourTurn) {
      const answer = findCorrectAnswer(game.number);
      setTimeout(() => {
        play(answer);
      }, 3000);
    }
  };

  useEffect(() => {
    // Note that: use axios rather than fetch for cleaner requester
    fetch(`http://localhost:4000/api/v1/games/${gameId}`)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(
            `${res.statusText}. Redirects to another page. (Not applied)`
          );
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
      const enhancedGame = enhanceGame(game);
      setGame(enhancedGame);

      playAuto(enhancedGame);
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
        <Link to="/">
          <button style={{ marginTop: 25 }}>Home Page</button>
        </Link>

        <h1>Game ({gameId})</h1>
        <div className="game-status x1_2">
          Game Status: <span style={{ fontWeight: 'bold' }}>{game.status}</span>
        </div>

        <div className="x1_2">
          Auto Play:
          <span style={{ fontWeight: 'bold' }}>
            {isAutoPlayActive ? 'active' : 'deactive'}
          </span>
        </div>
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
              className={`game-button ${isAutoPlayActive ? 'auto-play' : ''}`}
              onClick={
                game.isYourTurn && !isAutoPlayActive ? () => play(1) : null
              }
            >
              Increase (+1)
            </div>
            <div
              className={`game-button ${isAutoPlayActive ? 'auto-play' : ''}`}
              onClick={
                game.isYourTurn && !isAutoPlayActive ? () => play(0) : null
              }
            >
              Stay (0)
            </div>
            <div
              className={`game-button ${isAutoPlayActive ? 'auto-play' : ''}`}
              onClick={
                game.isYourTurn && !isAutoPlayActive ? () => play(-1) : null
              }
            >
              Decrease (-1)
            </div>
          </div>
        )}
        <div className="message-box">{getGameMessage(game)}</div>
        <RoundsTable rounds={game.rounds} />
      </div>
    );
  }
}

export default Game;
