#!/bin/bash

echo "🔧 Fixing React imports in all TypeScript files..."

# Find all .tsx files and add React import if missing
find src -name "*.tsx" -type f | while read file; do
    echo "Processing: $file"
    
    # Check if React is imported
    if ! grep -q "import React" "$file"; then
        echo "Adding React import to $file"
        sed -i '1i import React from '\''react'\'';' "$file"
    fi
    
    # Check if file uses React.Component but doesn't import React
    if grep -q "React\.Component" "$file" && ! grep -q "import React" "$file"; then
        echo "Adding React import for Component usage in $file"
        sed -i '1i import React from '\''react'\'';' "$file"
    fi
done

echo "✅ React imports fixed in all files!"
