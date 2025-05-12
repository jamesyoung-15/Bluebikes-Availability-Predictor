# Front-end: React + Vite + Tailwind

Front-end uses React + Vite written in Typescript. Style with Tailwind.

## Setup

- Enter this directory
- Install dependencies

``` bash
cd front-end
npm install
```

- Local server for dev

``` bash
npm run dev
```

- Build and serve static site to check before prod

``` bash
npm run build
serve -s dist
```

- If using S3 for front-end, sync to bucket:

``` bash
aws s3 sync ./dist s3://jyyoung.com --delete --profile Prod
```
