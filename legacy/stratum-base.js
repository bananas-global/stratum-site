/**
 * GitHub Pages project sites are served under /repo-name/.
 * Root-absolute paths (/about, /services) break on *.github.io/user/repo
 * but stay correct on a custom domain at /. Stylesheets use relative paths in HTML;
 * this script only rewrites remaining root-absolute links on github.io.
 */
(function () {
  'use strict';

  var base = '';
  if (location.hostname.endsWith('github.io')) {
    var seg = location.pathname.split('/').filter(Boolean)[0];
    if (seg) base = '/' + seg;
  }

  if (!base) return;

  function abs(path) {
    if (!path || path.charAt(0) !== '/' || path.indexOf('//') === 0) return path;
    return base + path;
  }

  function rewrite(el, attr) {
    var val = el.getAttribute(attr);
    if (val) el.setAttribute(attr, abs(val));
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="/"], link[href^="/"], script[src^="/"]').forEach(function (el) {
      rewrite(el, 'href');
      rewrite(el, 'src');
    });
  });
})();
