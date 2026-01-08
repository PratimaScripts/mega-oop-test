import cookie from 'react-cookies';
import { saveDataInCookie } from './cookie';

/**
 * Set the Lock Screen state
 * @param { Object } lockState - screen state
 * @param { Boolean } lockState.isLock - lock state of screen
 */
export const setLockScreenState = ({ isLock }) => {
  saveDataInCookie('screenLock', isLock)
}
/**
 * Get the Lock Screen state true/false
 * @returns {Boolean} will return True if screen locked
 */
export const getLockScreenState = () => {
  return cookie.load('screenLock') === "true";
};

