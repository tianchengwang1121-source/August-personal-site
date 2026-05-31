# Content Guide

This site is a static personal archive. There is no database or admin panel.

## Blog

Blog posts are maintained in:

`src/data/site.js`

Add a new object to `blogPosts`. Keep the newest post at the top.

Images should go in:

`public/images/blog`

Each post needs:

- `slug`
- `title`
- `date`
- `location`
- `image`
- `excerpt`
- `body`

## Timeline

Timeline entries are generated from `blogPosts`, so no separate timeline file is needed.

## Photos

Photo groups are maintained in:

`src/data/photos.js`

Images should go in:

`public/images/photos`

Keep the current group order unless the site design changes:

1. Street
2. Aircraft
3. Landscape

## Deployment Check

Before deploying, run:

```bash
npm run build
```
