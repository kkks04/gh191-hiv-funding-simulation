# Vercel Deployment

## Deploy from the Vercel dashboard

1. Push this folder to a GitHub repository.
2. In Vercel, select **Add New > Project** and import the repository.
3. Keep the detected project settings. The included `vercel.json` sets:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Select **Deploy**.

Future pushes to the production branch will deploy automatically.

## Deploy with the Vercel CLI

From this project directory:

```powershell
npx vercel
npx vercel --prod
```

The first command links or creates the Vercel project. The second publishes the
production deployment and prints its public URL.

## Local production check

```powershell
npm run build
npm run preview
```
