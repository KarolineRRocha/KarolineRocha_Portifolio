/**
 * Dynamic Asset Path Management
 *
 * This script automatically adjusts asset paths based on the environment:
 * - Localhost: Uses relative paths (e.g., 'assets/image.png')
 * - GitHub Pages: Uses absolute paths (e.g., '/KarolineRocha_Portfolio/assets/image.png')
 *
 * It applies the same logic as the dynamic href system for SPA routing.
 */

(function () {
  'use strict';

  // Environment detection
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isGitHubPages = window.location.hostname === 'karolinerrocha.github.io';
  const basePath = isGitHubPages ? '/KarolineRocha_Portfolio' : '';

  // Global function for getting asset paths
  window.getAssetPath = function (path) {
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    return basePath + '/' + path;
  };

  // Function to update asset paths for existing elements
  function updateAssetPaths() {
    // Update base href for GitHub Pages
    if (isGitHubPages) {
      const baseElement = document.querySelector('base');
      if (baseElement) {
        baseElement.href = '/KarolineRocha_Portfolio/';
      }
    }

    // Update all image paths
    const images = document.querySelectorAll('img[src^="/KarolineRocha_Portfolio/"]');
    images.forEach(function (img) {
      if (isLocalhost) {
        img.src = img.src.replace('/KarolineRocha_Portfolio/', '');
      }
    });

    // Update all favicon and icon paths
    const icons = document.querySelectorAll('link[href^="/KarolineRocha_Portfolio/"]');
    icons.forEach(function (link) {
      if (isLocalhost) {
        link.href = link.href.replace('/KarolineRocha_Portfolio/', '');
      }
    });

    // Update all script src paths
    const scripts = document.querySelectorAll('script[src^="/KarolineRocha_Portfolio/"]');
    scripts.forEach(function (script) {
      if (isLocalhost) {
        script.src = script.src.replace('/KarolineRocha_Portfolio/', '');
      }
    });

    // Update all anchor href paths that point to assets
    const anchors = document.querySelectorAll('a[href^="/KarolineRocha_Portfolio/assets/"]');
    anchors.forEach(function (anchor) {
      if (isLocalhost) {
        anchor.href = anchor.href.replace('/KarolineRocha_Portfolio/', '');
      }
    });
  }

  // Function to process new elements added to the DOM
  function processNewElements(node) {
    if (node.nodeType === 1) { // Element node
      // Process images
      const newImages = node.querySelectorAll ? node.querySelectorAll('img[src^="/KarolineRocha_Portfolio/"]') : [];
      newImages.forEach(function (img) {
        if (isLocalhost) {
          img.src = img.src.replace('/KarolineRocha_Portfolio/', '');
        }
      });

      // Process links
      const newLinks = node.querySelectorAll ? node.querySelectorAll('link[href^="/KarolineRocha_Portfolio/"]') : [];
      newLinks.forEach(function (link) {
        if (isLocalhost) {
          link.href = link.href.replace('/KarolineRocha_Portfolio/', '');
        }
      });

      // Process scripts
      const newScripts = node.querySelectorAll ? node.querySelectorAll('script[src^="/KarolineRocha_Portfolio/"]') : [];
      newScripts.forEach(function (script) {
        if (isLocalhost) {
          script.src = script.src.replace('/KarolineRocha_Portfolio/', '');
        }
      });

      // Process anchors
      const newAnchors = node.querySelectorAll ? node.querySelectorAll('a[href^="/KarolineRocha_Portfolio/assets/"]') : [];
      newAnchors.forEach(function (anchor) {
        if (isLocalhost) {
          anchor.href = anchor.href.replace('/KarolineRocha_Portfolio/', '');
        }
      });
    }
  }

  // Run immediately when script loads
  updateAssetPaths();

  // Set up MutationObserver to watch for dynamically added elements
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function (node) {
            processNewElements(node);
          });
        }
      });
    });

    // Start observing when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    } else {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // Export for use in other scripts
  window.DynamicAssets = {
    isLocalhost: isLocalhost,
    isGitHubPages: isGitHubPages,
    basePath: basePath,
    getAssetPath: window.getAssetPath,
    updateAssetPaths: updateAssetPaths
  };

  console.log('Dynamic Assets initialized:', {
    environment: isLocalhost ? 'localhost' : 'production',
    basePath: basePath
  });

})();
