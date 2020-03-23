const hooksMap = {
  bind: 'beforeMount',
  inserted: 'mounted',
  update: 'updated',
  componentUpdated: 'updated',
  unbind : 'unmounted',
}

const isAdaptedSymbol = Symbol();

export const isAdaptedDirective = directive => isAdaptedSymbol in directive;

export const createDirective = (options) => {
  if (typeof options === 'function' || isAdaptedDirective(options)) return options;

  const directive = {};
  Object.defineProperty(directive, isAdaptedSymbol, { value: true });

  const hooks = Object.keys(options);
  for (let i = 0; i < hooks.length; i++) { 
    const hookName = hooks[i];
    const handler = options[hookName];
    const mappedHookName = hooksMap[hookName];
    if (mappedHookName in directive) {
      const existingHandler = directive[mappedHookName];
      directive[mappedHookName] = function(...args) {
        existingHandler.apply(this, args);
        handler.apply(this, args);
      }
    } else {
      directive[mappedHookName] = handler;
    }
  }
  return directive;
}