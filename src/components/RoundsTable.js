function RoundsTable({ rounds = [] }) {
  return (
    <div className="rounds">
      <table>
        <thead>
          <tr>
            <th>Round #</th>
            <th>Player</th>
            <th>Starting No</th>
            <th>Selection</th>
            <th>Final No</th>
          </tr>
        </thead>

        <tbody>
          {rounds.map((round, index) => (
            <tr key={index}>
              <td>{round.id}</td>
              <td>{round.playerId}</td>
              <td>{round.startNo}</td>
              <td>{round.selection}</td>
              <td>{round.finalNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoundsTable;
