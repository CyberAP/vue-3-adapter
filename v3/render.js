import { h, withDirectives, resolveDirective, resolveComponent } from 'vue';
import { isHTMLTag, isVoidTag } from '@vue/shared';

export function wrapH(ctx) {
  return function(_element, _options, _children) {

    const element = transformElement(_element);

    if (!_children && !_options) {
      return h(element);
    }

    if (!_children && typeof _options !== 'object') {
      const children = Array.isArray(_options) ?
        transformChildren(_options) :
        _options;
      return h(element, null, children);
    }

    const { options, directives, slot, scopedSlots } = transformOptions(_options);

    let children;
    if (_children) {
      children = transformChildren(_children);
    } else if (scopedSlots) {
      children = scopedSlots;
    }

    let renderResult = children ? h(element, options, children) : h(element, options);

    if (directives.length !== 0) {
      renderResult = withDirectives(renderResult, ...directives);
    }

    if (slot !== undefined) {
      return {
        [slot]: renderResult
      }
    }

    return renderResult;
  };
}

const transformElement = (_element) => {
  const isGlobalComponent =
    typeof _element === 'string' &&
    !isHTMLTag(_element) &&
    // skip SVG check for now
    !isVoidTag(_element);
  return isGlobalComponent ? resolveComponent(_element) || _element : _element;
}

const transformChildren = (children) => {
  if (typeof children[0] !== 'object') return children;
  const slots = {};
  for (let i = 0; i < children.length; i++) {
    Object.assign(slots, children[i]);
  }
  return slots;
}

const transformOptions = (_options) => {
  const {
    attrs,
    props,
    on: events,
    domProps,
    directives: dirs,
    slot,
    scopedSlots,
    ...rest
  } = _options;

  const directives = transformDirectives(dirs);
  const options = rest;

  Object.assign(options, props);
  Object.assign(options, attrs);
  Object.assign(options, normalizeEvents(events));
  Object.assign(options, domProps);

  return {
    options,
    directives,
    slot,
    scopedSlots,
  }
}

const transformDirectives = (_directives = []) => {
  const directives = [];
  for (let i = 0; i < _directives.length; i++) {
    const directive = _directives[i];
    const { name, value, arg, modifiers } = directive; // 'expression' is not handled by Vue 3
    const dir = resolveDirective(name);
    directives.push([dir, value, arg, modifiers]);
  }
  return directives;
}

const normalizeEvents = (_events) => {
  const events = {};
  const keys = Object.keys(_events);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = _events[key];
    const normalizedKey = 'on' + key[0].toUpperCase() + key.slice(1);
    events[normalizedKey] = value;
  }
  return events;
}