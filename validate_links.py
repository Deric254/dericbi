#!/usr/bin/env python3
"""
Simple link validation script for dericBI website
Checks for broken internal links and missing files
"""

import os
import re
from pathlib import Path

def find_html_files(directory):
    """Find all HTML files in the directory"""
    return list(Path(directory).glob('*.html'))

def extract_links(html_content):
    """Extract href and src links from HTML content"""
    # Find href links
    href_pattern = r'href=["\']([^"\']+)["\']'
    src_pattern = r'src=["\']([^"\']+)["\']'
    
    hrefs = re.findall(href_pattern, html_content, re.IGNORECASE)
    srcs = re.findall(src_pattern, html_content, re.IGNORECASE)
    
    return hrefs + srcs

def validate_links(base_dir):
    """Validate all internal links in HTML files"""
    base_path = Path(base_dir)
    html_files = find_html_files(base_dir)
    
    print(f"🔍 Validating links in {len(html_files)} HTML files...")
    print("="*60)
    
    broken_links = []
    total_links = 0
    
    for html_file in html_files:
        print(f"\n📄 Checking: {html_file.name}")
        
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"❌ Error reading {html_file}: {e}")
            continue
            
        links = extract_links(content)
        local_links = [link for link in links if not link.startswith(('http://', 'https://', 'mailto:', 'tel:', '#', 'javascript:'))]
        
        print(f"   Found {len(local_links)} local links")
        total_links += len(local_links)
        
        for link in local_links:
            # Remove query parameters and fragments
            clean_link = link.split('?')[0].split('#')[0]
            
            # Build full path
            if clean_link.startswith('/'):
                target_path = base_path / clean_link[1:]
            else:
                target_path = base_path / clean_link
            
            if not target_path.exists():
                broken_links.append(f"   ❌ {html_file.name} -> {clean_link} (Missing: {target_path})")
                print(f"   ❌ BROKEN: {clean_link}")
            else:
                print(f"   ✅ OK: {clean_link}")
    
    print("\n" + "="*60)
    print(f"📊 VALIDATION SUMMARY")
    print("="*60)
    print(f"Total HTML files: {len(html_files)}")
    print(f"Total local links checked: {total_links}")
    print(f"Broken links found: {len(broken_links)}")
    
    if broken_links:
        print(f"\n🚨 BROKEN LINKS FOUND:")
        for broken in broken_links:
            print(broken)
        return False
    else:
        print(f"\n✅ ALL LINKS ARE VALID!")
        return True

if __name__ == "__main__":
    current_dir = Path(__file__).parent
    is_valid = validate_links(current_dir)
    
    if not is_valid:
        print(f"\n💡 RECOMMENDATIONS:")
        print("1. Check file names for case sensitivity issues")
        print("2. Ensure all referenced files exist")
        print("3. Verify path correctness")
    else:
        print(f"\n🎉 Your website navigation should work perfectly!")