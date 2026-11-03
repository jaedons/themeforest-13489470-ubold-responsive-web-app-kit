/* Ubold's legacy plugin boundary. Runtime: jQuery 4 + Bootstrap 5 only. */
(function ($, bootstrap) {
  'use strict';
  // APIs removed before jQuery 4; retained for bundled third-party plugins.
  $.isFunction = $.isFunction || function (value) { return typeof value === 'function'; };
  $.isArray = $.isArray || Array.isArray;
  $.isWindow = $.isWindow || function (value) { return value != null && value === value.window; };
  $.trim = $.trim || function (value) { return value == null ? '' : String(value).trim(); };
  $.now = $.now || Date.now;
  $.parseJSON = $.parseJSON || JSON.parse;
  $.unique = $.unique || $.uniqueSort;
  $.find.uniqueSort = $.find.uniqueSort || $.uniqueSort;
  $.find.getText = $.find.getText || $.text;
  $.camelCase = $.camelCase || function (value) {
    return value.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
  };
  $.isNumeric = $.isNumeric || function (value) {
    return (typeof value === 'number' || typeof value === 'string') && value !== '' && !isNaN(value - parseFloat(value));
  };
  $.nodeName = $.nodeName || function (element, name) { return !!element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase(); };
  $.fn.size = $.fn.size || function () { return this.length; };
  $.fn.andSelf = $.fn.andSelf || $.fn.addBack;
  // Bootstrap normally registers jQuery plugins at DOMContentLoaded. The original
  // template initializes components synchronously at the end of each document.
  Object.entries({ modal: 'Modal', collapse: 'Collapse', dropdown: 'Dropdown',
    tab: 'Tab', tooltip: 'Tooltip', popover: 'Popover', carousel: 'Carousel',
    alert: 'Alert', button: 'Button', scrollspy: 'ScrollSpy' }).forEach(function (entry) {
    const name = entry[0], Component = bootstrap[entry[1]];
    function plugin(option) {
      const args = arguments;
      return this.each(function () {
        const config = typeof option === 'object' ? Object.assign({}, option) : {};
        if (name === 'collapse' && typeof option === 'string') config.toggle = false;
        if (config.placement && config.placement.includes(' ')) config.placement = config.placement.replace(/auto\s*/g, '').trim() || 'auto';
        const instance = Component.getOrCreateInstance(this, config);
        if (typeof option === 'string') {
          if (option === 'destroy') instance.dispose();
          else if (typeof instance[option] === 'function') instance[option].apply(instance, Array.prototype.slice.call(args, 1));
        } else if (name === 'modal' && config.show !== false) instance.show();
      });
    }
    plugin.Constructor = Component;
    $.fn[name] = plugin;
    // Prevent Bootstrap's deferred registration from replacing this adapter.
    Component.jQueryInterface = plugin;
  });
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.nav-tabs > li.active > a, .nav-pills > li.active > a').forEach(function (link) {
      link.classList.add('active');
    });
  });
  document.addEventListener('shown.bs.tab', function (event) {
    const link = event.target;
    const nav = link.closest('.nav');
    if (nav) {
      nav.querySelectorAll(':scope > li').forEach(function (item) { item.classList.toggle('active', item === link.parentElement); });
    }
  });
})(window.jQuery, window.bootstrap);
