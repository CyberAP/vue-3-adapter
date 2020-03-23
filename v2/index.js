import Vue from 'vue';

export const initVueApp = (options) => {
  return new Vue(options);
};

export const registerGlobals = ({ plugins = [], directives = [], components = [], mixins = [] }) => {
  plugins.forEach(([plugin, options]) => Vue.use(plugin, options));
  directives.forEach(([name, options]) => Vue.directive(name, options));
  components.forEach(([name, component]) => Vue.component(name, component));
  mixins.forEach(([name, mixin]) => Vue.mixin(name, mixin));
};

export const wrapH = (h) => { return h; };

export const createDirective = (options) => { return options; };

export function extractListeners(context) {
  return context.$listeners || this.$listeners;
}

export const observable = Vue.observable;