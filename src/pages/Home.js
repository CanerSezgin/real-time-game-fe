import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import mockPlayerIdService from '../utils/mockPlayerIdService';
import mockAutoPlayService from '../utils/mockAutoPlayService';
import Games from '../components/Games';
import './Home.scss';

function Home({ socket }) {
  const history = useHistory();
  const playerId = mockPlayerIdService().getPlayerId();

  const [isAutoPlayActive, setAutoPlay] = useState(
    mockAutoPlayService().isActive()
  );

  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/api/v1/games`)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(
            `${res.statusText}. Redirects to another page. (Not applied)`
          );
        }
        return res.json();
      })
      .then(({ games }) => {
        setGames(games);
      });

    socket.on('go-to-game', (gameId) => {
      return history.push(`game/${gameId}`);
    });
  }, [socket]);

  const switchAutoPlay = () => {
    const switched = !isAutoPlayActive;
    setAutoPlay(switched);
    mockAutoPlayService().switchValue();
  };

  const joinGame = async () => {
    // Note that: more generic solution like generic requester client can be applied to encapsulate baseurl.
    const url = `http://localhost:4000/api/v1/games/join`;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    };

    const { game } = await (await fetch(url, requestOptions)).json();
    history.push(`game/${game.id}`);
  };

  return (
    <div className="home">
      <h1>Welcome to Game</h1>

      <div style={{ margin: '10px 0' }}>
        <button onClick={joinGame}>Join Game</button>
      </div>

      <div>
        <div>
          <p>
            If auto play is activated, you won't be able to make any selection.
          </p>
          <p>
            When it is your time, it will automatically play after{' '}
            <span className="special">3 seconds </span>
            later. (just for having better/slow UX)
          </p>
        </div>
        <button className="auto-play-btn" onClick={switchAutoPlay}>
          {isAutoPlayActive ? 'Deactivate Auto Play' : 'Activate Auto Play'}
        </button>
        <span style={{ marginLeft: 10 }}>
          AutoPlay:{' '}
          <span className="special">
            {isAutoPlayActive ? 'Active' : 'Deactive'}
          </span>
        </span>
      </div>

      <div className="game-logic">
        <h3> Game Business Logic</h3>
        <ol>
          <li>
            {' '}
            Join game. It will check whether there is existing pending game (It
            has only one user).{' '}
          </li>
          <ul>
            <li>
              Yes, play as second player. Get existing gameId, redirect user
              into /game/:gameId{' '}
            </li>
            <li>
              No, create new game, play as first player. Redirect user into game
              page but user can't play since game status is pending.
            </li>
          </ul>

          <li>
            If you know gameId that you are not one of the player of it, you can
            visit the game page and watch the game as{' '}
            <span className="special">visitor</span>.
          </li>
          <li>
            After game is done, you can revisit the game page if you know the
            gameId and see game results.
          </li>
        </ol>
      </div>

      <div style={{ marginTop: 50 }}>
        <Games games={games} />
        {/* Note that: Pagination should be applied rather than showing all games. */}
      </div>
    </div>
  );
}

export default Home;
