# Google Search Console Checklist

After deploying your SEO and structured data changes, here's what you should do in Google Search Console:

## ✅ Immediate Actions

### 1. **Request Re-indexing** (Most Important)
   - Go to: https://search.google.com/search-console
   - Navigate to: **URL Inspection** (left sidebar)
   - Enter your homepage URL: `https://www.easalesltd.co.uk/`
   - Click **"Request Indexing"**
   - This tells Google to re-crawl your site with the new SEO changes

### 2. **Submit Updated Sitemap** (Optional but Recommended)
   - Go to: **Sitemaps** (left sidebar)
   - Your sitemap should already be submitted: `https://www.easalesltd.co.uk/sitemap.xml`
   - If it's already there, you can click **"Resubmit"** to refresh it
   - This helps Google discover all your pages faster

### 3. **Check Structured Data** (Monitor for Errors)
   - Go to: **Enhancements** (left sidebar)
   - Check these sections:
     - **FAQ** - Should show 1 valid item
     - **Breadcrumbs** - Should show 1 valid item
     - **Organization** - Should show 1 valid item
     - **Local Business** - Should show 1 valid item
   - Look for any errors or warnings
   - If you see errors, they should match what we fixed (Product snippets should be gone)

### 4. **Monitor Performance** (Track Results)
   - Go to: **Performance** (left sidebar)
   - Monitor over the next 2-4 weeks for:
     - Changes in search appearance
     - New queries bringing traffic
     - Click-through rates from search results

## 📋 What to Expect

### Timeline:
- **24-48 hours**: Google will re-crawl your site
- **1-2 weeks**: New title/description may appear in search results
- **2-4 weeks**: Structured data enhancements should be fully recognized
- **1-3 months**: Full impact of SEO changes visible

### What You Should See:
- ✅ Homepage title changes to "Dave Langdon - Greeting Card & Gift Sales Agent"
- ✅ Description emphasizes "Sales Agent serving the wholesale trade"
- ✅ Rich results (FAQ snippets, breadcrumbs) may appear
- ✅ Better visibility for "sales agent" searches

## 🔍 Testing Your Changes

### Test Structured Data:
1. Use **Rich Results Test**: https://search.google.com/test/rich-results
   - Test your homepage URL
   - Should show: Breadcrumbs, FAQ, Local Business, Organization (all valid)

### Test Search Appearance:
1. Search for: `site:easalesltd.co.uk`
2. Check if the new title/description appears
3. Note: May take 1-2 weeks to update

## ⚠️ Important Notes

- **Don't worry** if changes don't appear immediately - Google takes time to re-index
- **Don't request indexing** too frequently (once per day max for homepage)
- **Monitor** Search Console for any new errors or warnings
- The sitemap is updated and will be automatically picked up by Google

## 🎯 Key Pages to Monitor

After requesting indexing, also check these pages in Search Console:
- `/about` - About page with Person schema
- `/contact` - Contact page with ContactPage schema
- `/recipes` - Recipes listing with CollectionPage schema
- `/companies/museums-and-galleries` - Company page with Organization schema

---

**Status**: Sitemap updated ✅ | Ready for Search Console actions ✅
