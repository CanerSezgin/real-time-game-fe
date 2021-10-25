function Player({ playerId, game, yourId }) {
  const winnerCls = playerId && game.winner === playerId ? 'won' : '';
  const playingCls = playerId && game.playing === playerId ? 'playing' : '';
  return (
    <div className={`player ${winnerCls} ${playingCls}`}>
      <div className="player-avatar">
        <img
          src={
            playerId
              ? 'https://avatarairlines.com/wp-content/uploads/2020/05/Male-placeholder.jpeg'
              : 'https://media.istockphoto.com/vectors/vector-of-armchair-icon-chair-icon-in-trendy-flat-style-vector-id1219757773?k=20&m=1219757773&s=170667a&w=0&h=0oiPjEhQP1FKF8mhxslJUnuSVCGmEJyrb6rQuoMIm_w='
          }
          alt="player"
        />
      </div>
      <div className="player-name">
        {playerId} {yourId === playerId ? '(You)' : ''}{' '}
      </div>
    </div>
  );
}

export default Player;
