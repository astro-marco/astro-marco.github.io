# IgeA Website

Modern website for the IgeA health data management application.

## Architecture

The website is built using a component-based architecture with vanilla HTML, CSS, and JavaScript for optimal performance:

- **Components**: Reusable UI elements stored in `/components/`
- **Dual Component Loaders**:
  - Primary loader: `js/utils/async-component-loader.js` for optimized asynchronous loading
  - Secondary loader: `js/utils/component-loader.js` for backward compatibility
- **Module Splitting**: Critical modules loaded first, non-critical modules loaded during browser idle time
- **Responsive Design**: Adaptive layouts for all device sizes via media queries

## Performance Optimizations

- **Component Caching**: Components are cached after first load to reduce HTTP requests
- **Asynchronous Loading**: Non-critical components load asynchronously to avoid render blocking
- **Critical CSS Inlining**: Core styles embedded directly in HTML for fastest rendering
- **Critical Path Rendering**: Core layout loads first, non-critical components load later
- **Placeholder System**: Dynamic placeholders with animations to prevent layout shifts during loading
- **Progressive Enhancement**: Basic functionality works even if scripts fail to load
- **Prioritized Resource Loading**: Critical resources are loaded first, others during idle time
- **Intersection Observer**: Components and images load only when they come into viewport

## CSS Organization

- **Base**: Variables, reset, and typography fundamentals
- **Components**: Isolated component styles (buttons, hero, features, etc.)
- **Layout**: Structural elements like navbar and footer
- **Pages**: Page-specific styles
- **Utils**: Helper classes and utilities including responsive breakpoints

## Development

```bash
# Start development server
npm start
```

## Folder Structure

- `/components/` - Reusable HTML components
- `/css/` - Modular styles organized by functionality
- `/js/` - JavaScript modules and utilities
  - `/js/modules/` - Feature-specific code (navigation, faq, etc.)
  - `/js/utils/` - Utility functions and component loaders
- `/img/` - Image assets and icons
