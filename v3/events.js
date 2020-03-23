export function extractListeners(context) {
  const ctx = context || this;
  const listeners = {};
  Object.keys(ctx)
    .filter(key => key.startsWith('on'))
    .forEach(key => {
      const newKey = key.charAt(2).toLowerCase() + key.slice(3);
      listeners[newKey] = ctx[key];
    });
  return listeners;
}