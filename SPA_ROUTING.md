# 🔗 SPA Routing Configuration for GitHub Pages

## 📋 Overview

This document explains how Single Page Application (SPA) routing is configured for GitHub Pages deployment to handle direct URL access and page refreshes.

## 🚨 The Problem

When deploying Angular applications to GitHub Pages, you may encounter these issues:

- **Direct URL access**: `https://your-site.github.io/about_me` returns 404
- **Page refresh**: Refreshing on any page other than homepage returns 404
- **Browser back/forward**: Navigation doesn't work properly

This happens because GitHub Pages doesn't know how to handle Angular routes - it looks for actual files at those paths.

## ✅ The Solution

We've implemented a comprehensive SPA routing solution using the [spa-github-pages](https://github.com/rafgraph/spa-github-pages) approach:

### 1. 404.html Redirect Script

The `src/assets/404.html` file contains a script that:
- Intercepts 404 errors from GitHub Pages
- Converts the URL path into a query parameter
- Redirects to the main application with the correct route

### 2. index.html Route Handler

The `src/index.html` file includes a script that:
- Checks for redirect parameters in the URL
- Restores the original route using `window.history.replaceState()`
- Allows the Angular router to handle the navigation

### 3. Automatic Build Integration

The build process automatically:
- Copies `404.html` to the root of the build output
- Ensures proper file placement for GitHub Pages
- Validates the routing configuration

## 🔧 How It Works

### Step-by-Step Process

1. **User visits**: `https://karolinerrocha.github.io/KarolineRocha_Portfolio/about_me`
2. **GitHub Pages**: Looks for `/about_me` file (doesn't exist)
3. **404.html**: Intercepts the request and redirects to:
   `https://karolinerrocha.github.io/KarolineRocha_Portfolio/?/about_me`
4. **index.html**: Script detects the `?/about_me` parameter
5. **History API**: Restores the original URL: `/about_me`
6. **Angular Router**: Takes over and displays the correct component

### File Structure

```
dist/KarolineRocha_Portfolio/
├── index.html          # Main application with route handler
├── 404.html           # Redirect script for GitHub Pages
├── assets/            # Application assets
└── ...                # Other build files
```

## 🛠️ Configuration Files

### src/assets/404.html
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Karoline Rocha Portfolio</title>
    <script type="text/javascript">
        // Redirect script for GitHub Pages SPA routing
        var pathSegmentsToKeep = 1;
        var l = window.location;
        l.replace(
            l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
            l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
            l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
            (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
            l.hash
        );
    </script>
</head>
<body>
    <!-- This page handles GitHub Pages SPA routing -->
</body>
</html>
```

### src/index.html (relevant part)
```html
<!-- GitHub Pages SPA routing script -->
<script type="text/javascript">
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');
      window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  }(window.location))
</script>
```

## 🧪 Testing the Configuration

### Local Testing
```bash
# Build the application
./build-prod.sh

# Check if 404.html is in the build output
ls -la dist/KarolineRocha_Portfolio/404.html

# Verify the content
head -10 dist/KarolineRocha_Portfolio/404.html
```

### Production Testing
After deployment, test these URLs:
- ✅ `https://karolinerrocha.github.io/KarolineRocha_Portfolio/` (homepage)
- ✅ `https://karolinerrocha.github.io/KarolineRocha_Portfolio/about_me` (direct access)
- ✅ `https://karolinerrocha.github.io/KarolineRocha_Portfolio/projects` (direct access)
- ✅ `https://karolinerrocha.github.io/KarolineRocha_Portfolio/contact` (direct access)
- ✅ Refresh on any page (should work)

## 🔄 Build Process Integration

### Automatic Setup
The build process automatically handles SPA routing:

1. **Build Application**: `npm run build:prod`
2. **Copy 404.html**: Script copies the file to build root
3. **Verify Setup**: Checks that routing files are in place
4. **Deploy**: GitHub Actions deploys to GitHub Pages

### Manual Verification
```bash
# Check build output
ls -la dist/KarolineRocha_Portfolio/

# Should include:
# - index.html
# - 404.html  ← This is crucial for SPA routing
# - assets/
# - *.js files
```

## 🚨 Troubleshooting

### Common Issues

#### 404.html Not Found
**Problem**: `404.html` is missing from build output
**Solution**:
1. Check if `src/assets/404.html` exists
2. Verify build script is copying the file
3. Check GitHub Actions logs

#### Routes Still Return 404
**Problem**: Direct URL access still doesn't work
**Solution**:
1. Verify `404.html` is in the root of the deployed site
2. Check browser console for JavaScript errors
3. Ensure GitHub Pages is serving the correct files

#### Refresh Not Working
**Problem**: Page refresh returns 404
**Solution**:
1. Verify both `404.html` and `index.html` scripts are present
2. Check that the redirect script is working
3. Test with browser developer tools

### Debug Commands

```bash
# Check if 404.html exists in build
ls -la dist/KarolineRocha_Portfolio/404.html

# Verify 404.html content
grep -n "spa-github-pages" dist/KarolineRocha_Portfolio/404.html

# Check index.html for route handler
grep -n "window.history.replaceState" dist/KarolineRocha_Portfolio/index.html
```

## 📚 Additional Resources

- [spa-github-pages](https://github.com/rafgraph/spa-github-pages) - Original solution
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Angular Router Documentation](https://angular.io/guide/router)

## ✅ Verification Checklist

- [ ] `src/assets/404.html` exists and contains redirect script
- [ ] `src/index.html` includes route handler script
- [ ] Build process copies `404.html` to build root
- [ ] GitHub Actions workflow includes SPA routing setup
- [ ] All routes work with direct URL access
- [ ] Page refresh works on all routes
- [ ] Browser back/forward navigation works

---

**🎉 Result**: Your Angular application now works perfectly on GitHub Pages with full SPA routing support!
