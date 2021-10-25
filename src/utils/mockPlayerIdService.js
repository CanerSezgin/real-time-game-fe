const mockPlayerIdService = () => {
  const key = '__game_player_id';

  const getFromSessionStorage = () => {
    return window.sessionStorage.getItem(key);
  };
  const setSessionStorage = (playerId = '') => {
    window.sessionStorage.setItem(key, playerId);
  };

  const generateRandomId = () => 'Player_' + new Date().getTime().toString();

  const getPlayerId = () => {
    const idFromStorage = getFromSessionStorage();
    if (idFromStorage) return idFromStorage;

    const newId = generateRandomId();
    setSessionStorage(newId);
    return newId;
  };

  return {
    getPlayerId,
  };
};

export default mockPlayerIdService;
