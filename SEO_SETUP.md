# SEO Setup – ALEXA Online Classes

Production site: https://alexaonlineclasses.vercel.app/

## 1. Add the site to Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console).
2. Click **Add property** and choose **URL prefix**.
3. Enter `https://alexaonlineclasses.vercel.app/` and continue.
4. Verify ownership using either method:
   - **HTML tag:** copy the meta tag from Search Console and add it inside the `<head>` of `index.html`, then redeploy.
   - **HTML file:** download the verification file, place it in the project root, then redeploy. Keep the file in place.
5. Return to Search Console and click **Verify**.

If a custom domain is added later, create a **Domain** property instead and verify with DNS.

## 2. Submit the sitemap

1. In Search Console, open **Indexing → Sitemaps**.
2. Enter `sitemap.xml` (or the full URL `https://alexaonlineclasses.vercel.app/sitemap.xml`).
3. Click **Submit**.
4. Confirm that `robots.txt` lists the same sitemap URL.

After deployment, open `https://alexaonlineclasses.vercel.app/sitemap.xml` to confirm it loads without errors.

## 3. Request indexing

1. Open **URL Inspection** in Search Console.
2. Enter `https://alexaonlineclasses.vercel.app/` and click **Request indexing**.
3. Repeat for the most important pages:
   - `/courses.html`
   - `/pricing.html`
   - `/free-class.html`
   - `/demo.html`
   - `/blog.html`
   - `/contact-us.html`
4. Do not submit the same URL repeatedly. Google limits daily requests and will crawl the site naturally.

## 4. Monitor after launch

- Check **Indexing → Pages** for indexing errors and excluded URLs.
- Check **Indexing → Sitemaps** for sitemap processing status.
- Use **Enhancements** to confirm the EducationalOrganization and WebSite structured data are valid.
- Test the homepage with the [Rich Results Test](https://search.google.com/test/rich-results).
- Keep `tracker.html` and `404.html` out of search results; both are marked `noindex`.
- When pages are added or removed, update `sitemap.xml` and request reindexing for important changes.

## Notes

- Canonical URLs use `https://alexaonlineclasses.vercel.app/`.
- `dictionary.html` and `monthly-news.html` are consolidated into `vocabulary.html` and `blog.html` through canonical tags and are intentionally left out of the sitemap.
- Public pages are allowed in `robots.txt`; the sitemap is declared there.
