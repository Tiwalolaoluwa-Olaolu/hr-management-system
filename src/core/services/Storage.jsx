const SESSION_KEY = 'hrms_session';

export const getSession = () => {
  try {
    const session = sessionStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const saveSession = (user) => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
};