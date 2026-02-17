'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

// Ensure library is loaded (importing the config file)
import '@/lib/fontawesome';

export default function IconRenderer({ className, ...props }) {
  if (!className) return null;

  // Expected formats: "fa-brands fa-react", "fab fa-react", "fas fa-code", "fa-solid fa-code"
  const parts = className.split(' ');
  
  let prefix = 'fas'; // default to solid
  let iconName = '';

  // Parse class string to find prefix and icon name
  parts.forEach(part => {
    if (part === 'fa-brands' || part === 'fab') prefix = 'fab';
    if (part === 'fa-solid' || part === 'fas') prefix = 'fas';
    if (part.startsWith('fa-') && part !== 'fa-brands' && part !== 'fa-solid') {
      iconName = part.replace('fa-', '');
    }
  });

  if (!iconName) {
    // Fallback or return original i tag if parsing fails
    return <i className={className} {...props}></i>;
  }

  // Check if icon exists in library (optional, but FA handles missing icons gracefully usually)
  
  return <FontAwesomeIcon icon={[prefix, iconName]} className={className} {...props} />;
}
