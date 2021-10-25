const mockAutoPlayService = () => {
    const key = '__game_auto_play';
  
    const getFromStorage = () => {
      return window.sessionStorage.getItem(key);
    };
    const setToStorage = (isActive) => {
      window.sessionStorage.setItem(key, isActive ? 1 : 0);
    };

    const switchValue = () => {
        const currentValue = isActive()
        const newValue = !currentValue
        setToStorage(newValue)
    };

    const isActive = () => {
        const value = getFromStorage()
        if(value == null || value == '0') return false
        return true
    };
  
    return {
        switchValue,
        isActive
    };
  };
  
  export default mockAutoPlayService;
  