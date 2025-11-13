#!/bin/bash
# Script to optimize images in the public folder
# Converts large PNGs to WebP format and compresses them

echo "Optimizing images in public folder..."

# Check if sharp-cli is available (for image optimization)
if ! command -v sharp-cli &> /dev/null; then
    echo "Installing sharp-cli for image optimization..."
    npm install -g sharp-cli
fi

# Find all PNG files larger than 500KB
find public -name "*.png" -size +500k | while read file; do
    echo "Processing: $file"
    
    # Get filename without extension
    filename="${file%.*}"
    
    # Convert to WebP with 80% quality
    sharp-cli -i "$file" -o "${filename}.webp" -q 80
    
    # Get original and new sizes
    original_size=$(du -h "$file" | cut -f1)
    new_size=$(du -h "${filename}.webp" | cut -f1)
    
    echo "  Original: $original_size -> WebP: $new_size"
    
    # Optionally remove original PNG (uncomment if you want to replace)
    # rm "$file"
done

echo "Image optimization complete!"

