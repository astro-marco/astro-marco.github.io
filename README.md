# IgeA Website

Modern website for the IgeA health data management application.

## Architecture

The website is built using a component-based architecture with vanilla HTML, CSS, and JavaScript for optimal performance:

- **Components**: Reusable UI elements stored in `/components/`
- **Component Loader**: Dynamic loading with caching optimization in `js/utils/component-loader.js`
- **Module Splitting**: Critical modules loaded first, non-critical modules loaded during browser idle time

## Performance Optimizations

- **Component Caching**: Components are cached after first load to reduce HTTP requests
- **Critical Path Rendering**: Core layout loads first, non-critical components load later
- **Placeholder Dimensions**: Pre-sized placeholders to avoid layout shifts
- **Progressive Enhancement**: Basic functionality works even if scripts fail to load

## Development

```bash
# Start development server
npm start
```

## Folder Structure
