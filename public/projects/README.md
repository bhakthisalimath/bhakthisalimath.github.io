# Project images (automatic collage)

Put **any number** of images in the folder named after the project **`id`** in `src/data/projects.ts`:

`public/projects/<id>/`

Supported: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.avif`, `.svg` (any subfolder is OK too).

They show up **automatically** in the Projects tab after the YouTube demo (or as a collage only if there’s no video). **No edits to `projects.ts` needed** for images.

## Refresh the list

Whenever you add or remove files, run:

```bash
npm run sync:project-assets
```

Or restart dev / run build — **`predev`** and **`prebuild`** run this for you.

The script writes `src/data/projectGalleries.auto.json` (commit it when you add images so CI/deploy sees them).

## YouTube demo videos

Edit **`src/data/projectYoutubeDemos.ts`**: add one line per project, using the same **`id`** as in `projects.ts`:

```ts
my-project-id: "https://youtu.be/xxxxxxxxxxx",
```

You can paste a watch URL, `youtu.be` link, or the raw 11-character video id.
