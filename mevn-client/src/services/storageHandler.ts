/**
 * modify the type of accepted strings when session storage instances are added or modified
 */
export type TLocalStorageNames = 'jwt'

const isValidString = (name: string): boolean => {
  if (name === '' || typeof name !== 'string') {
    console.error(`invalid name "${name}" given to storage service`);
    return false;
  }
  return true;
};

/**
 * Creates a local storage service to deal with JSON values and specify its accepted types
 */
export const localService = {
  /**
   * get JSON-parsed values from local storage
   * @param {TLocalStorageNames} name
   * @returns {string | undefined}
   */
  get: (name: TLocalStorageNames): string | undefined => {
    if (isValidString(name)) {
      try {
        const res = localStorage.getItem(name);
        if (res) {
          return JSON.parse(res);
        }
      } catch (err) {
        console.warn(err);
      }
    }
    return undefined;
  },

  /**
   * Save any string, object or array to the local storage
   * @param {TLocalStorageNames} name
   * @param {string | Record<string, unknown> | Array<any>} value
   */
  set: (name: TLocalStorageNames, value: string | Record<string, unknown> | Array<any>): void => {
    if (isValidString(name)) {
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch (err) {
        console.warn(err);
      }
    }
  },

  /**
   * Add any value to an existing local storage entry or create the entry
   * @param {TLocalStorageNames} name
   * @param newValue
   */
  add: (name: TLocalStorageNames, newValue: any): void => {
    const currentValue: any = localService.get(name);
    const res = Array.isArray(currentValue) ? currentValue : [];
    if (!res.includes(newValue)) {
      res.push(newValue);
    }
    try {
      localService.set(name, res);
    } catch (err) {
      console.warn(err);
    }
  },

  /**
   * remove an entry from the local storage
   * @param {TLocalStorageNames} name
   */
  remove: (name: TLocalStorageNames): void => {
    if (isValidString(name)) {
      try {
        localStorage.removeItem(name);
      } catch (err) {
        console.warn(err);
      }
    }
  },

  /**
   * clear the local storage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (err) {
      console.warn(err);
    }
  },
};
