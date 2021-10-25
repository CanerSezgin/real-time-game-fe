import { Link } from 'react-router-dom';

function Games({ games = [] }) {
  const getStartNo = (rounds = []) => {
    return (rounds[0] || {}).startNo;
  };

  const getFinalNo = (rounds = []) => {
    return (rounds[rounds.length - 1] || {}).finalNo;
  };

  return (
    <div className="games">
      <table>
        <thead>
          <tr>
            <th>Game ID</th>
            <th>Created At</th>
            <th>Player 1</th>
            <th>Player 2</th>
            <th>Status </th>
            <th>Winner</th>
            <th>Start No</th>
            <th>Final No</th>
          </tr>
        </thead>

        <tbody>
          {games.map((game, index) => (
            <tr key={index}>
              <td>
                <Link to={`/game/${game.id}`} style={{ color: 'darkred' }}>
                  {game.id}
                </Link>
              </td>
              <td>{new Date(game.createdAt).toLocaleString()}</td>
              <td>{(game?.players || [])[0]}</td>
              <td>{(game?.players || [])[1]}</td>
              <td>{game.status}</td>
              <td>{game.winner || '-'}</td>
              <td>{getStartNo(game.rounds)}</td>
              <td>{getFinalNo(game.rounds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Games;
