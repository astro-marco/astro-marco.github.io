# IgeA Website

Modern website for the IgeA health data management application.

## Architecture

The website is built using a component-based architecture with vanilla HTML, CSS, and JavaScript for optimal performance:

- **Components**: Reusable UI elements stored in `/components/`
- **Component Loader**: Asynchronous loading with performance optimization in `js/utils/async-component-loader.js`
- **Module Splitting**: Critical modules loaded first, non-critical modules loaded during browser idle time

## Performance Optimizations

- **Component Caching**: Components are cached after first load to reduce HTTP requests
- **Asynchronous Loading**: Non-critical components load asynchronously to avoid render blocking
- **Critical CSS Inlining**: Core styles embedded directly in HTML for fastest rendering
- **Critical Path Rendering**: Core layout loads first, non-critical components load later
- **Placeholder Dimensions**: Pre-sized placeholders to avoid layout shifts
- **Progressive Enhancement**: Basic functionality works even if scripts fail to load
- **Prioritized Resource Loading**: Critical resources are loaded first, others during idle time

## Development

```bash
# Start development server
npm start
```

## Folder Structure

- `/components/` - Reusable HTML components
- `/css/` - Styles organized by component and function
- `/js/` - JavaScript modules and utilities
- `/img/` - Image assets
