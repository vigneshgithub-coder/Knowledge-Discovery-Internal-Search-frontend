// User storage utility for localStorage management

export const userStorage = {
  // Save user info to localStorage
  saveUserInfo: (userInfo) => {
    try {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      return true;
    } catch (error) {
      console.error('Failed to save user info:', error);
      return false;
    }
  },

  // Get user info from localStorage
  getUserInfo: () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  },

  // Check if user info exists
  userInfoExists: () => {
    return !!userStorage.getUserInfo();
  },

  // Get user ID
  getUserId: () => {
    const userInfo = userStorage.getUserInfo();
    return userInfo?.userId || userInfo?.id || null;
  },

  // Get user name
  getUserName: () => {
    const userInfo = userStorage.getUserInfo();
    return userInfo?.name || null;
  },

  // Get user email
  getUserEmail: () => {
    const userInfo = userStorage.getUserInfo();
    return userInfo?.email || null;
  },

  // Get user mobile
  getUserMobile: () => {
    const userInfo = userStorage.getUserInfo();
    return userInfo?.mobile || null;
  },

  // Clear user info
  clearUserInfo: () => {
    try {
      localStorage.removeItem('userInfo');
      return true;
    } catch (error) {
      console.error('Failed to clear user info:', error);
      return false;
    }
  }
};

// Backward compatibility exports
export const getUserInfo = userStorage.getUserInfo;
export const setUserInfo = userStorage.saveUserInfo;
export const clearUserInfo = userStorage.clearUserInfo;
export const isUserInfoPresent = userStorage.userInfoExists;
