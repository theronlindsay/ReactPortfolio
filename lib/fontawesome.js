import { library, config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Import all icons (or a subset if bundle size is a concern, but for a portfolio "all" is often requested to support dynamic DB values)
// Since we can't easily import *everything* without massive bundle size, we generally import packs.
// However, the user wants to use ANY icon string from DB. 
// The strictly correct way without dynamic imports (which FA doesn't support easily for all) is to import what we need or use the CDN.
// EXPECTATION: User wants to use `npm` packages. We should import the "free-brands" and "free-solid" packs entirely if possible or instruct user.
// actually, importing *all* is bad practice but requested for "dynamic from DB". 
// A better middle ground: Import the specific packs fully.

import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Add to library
library.add(fab, fas);

// Prevent auto CSS addition to avoid hydration mismatch
config.autoAddCss = false;
