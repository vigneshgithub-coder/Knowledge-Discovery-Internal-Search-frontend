// User info utility functions for localStorage management

const USER_INFO_KEY = 'userInfo';
const USER_ID_KEY = 'userId';

export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error getting user info from localStorage:', error);
    return null;
  }
};

export const saveUserInfo = (info) => {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
    // Also save userId separately for easy access
    if (info.userId) {
      localStorage.setItem(USER_ID_KEY, info.userId);
    }
  } catch (error) {
    console.error('Error saving user info to localStorage:', error);
  }
};

export const userInfoExists = () => {
  const userInfo = getUserInfo();
  return userInfo && userInfo.name && userInfo.email && userInfo.mobile && userInfo.userId;
};

export const getUserId = () => {
  try {
    return localStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error('Error getting userId from localStorage:', error);
    return null;
  }
};

export const clearUserInfo = () => {
  try {
    localStorage.removeItem(USER_INFO_KEY);
    localStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.error('Error clearing user info from localStorage:', error);
  }
};
