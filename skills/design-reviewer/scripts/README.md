# Puppeteer Scripts

Simple scripts for visual inspection via Chrome remote debugging.

## Prerequisites

1. Chrome running with remote debugging:
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
   ```

2. Install puppeteer-core:
   ```bash
   npm install puppeteer-core
   ```

## Scripts

### screenshot.js
Capture viewport screenshot.

```bash
node screenshot.js [width] [height] [filename]
```

Examples:
```bash
node screenshot.js 375 667 mobile.png
node screenshot.js 768 1024 tablet.png
node screenshot.js 1440 900 desktop.png
```

### eval.js
Run any JavaScript in the page context.

```bash
node eval.js "JavaScript expression"
```

Examples:
```bash
# Check for overflow
node eval.js "document.body.scrollWidth > window.innerWidth"

# Get all headings
node eval.js "[...document.querySelectorAll('h1,h2,h3')].map(h => h.tagName)"

# Check font sizes
node eval.js "[...document.querySelectorAll('p')].map(p => getComputedStyle(p).fontSize)"
```

## Output

- Screenshots saved to current directory
- eval.js prints JSON to stdout
