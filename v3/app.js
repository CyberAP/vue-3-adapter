import { createApp, reactive } from 'vue';
import { createDirective } from './directives';

const globals = {
  plugins: [],
  directives: [],
  components: [],
  mixins: [],
};

export function registerGlobals({ plugins = [], directives = [], components = [], mixins = [] }) {
  globals.plugins = globals.plugins.concat(plugins);
  globals.directives = globals.directives.concat(directives);
  globals.components = globals.components.concat(components);
  globals.mixins = globals.mixins.concat(mixins);
}

function applyGlobals(app) {
  globals.plugins.forEach(([plugin, options]) => {
    const install = plugin.install || plugin;
    app.use(wrapPluginInstall(install), options);
  });
  globals.directives.forEach(([name, options]) => app.directive(name, createDirective(options)));
  globals.components.forEach(([name, component]) => app.component(name, component));
  globals.mixins.forEach(([name, mixin]) => app.mixin(name, mixin));
}

const wrapPluginInstall = (install) => { 
  return function (Vue, options) {
    Vue.observable = reactive;
    install(Vue, options);
  };
}

export function initVueApp({ el, ...options }) {
  const app = createApp(options);

  applyGlobals(app);

  if (el) app.mount(el);

  app.$mount = app.mount;

  return app;
}
