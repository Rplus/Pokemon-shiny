#!/usr/bin/env sh

# abort on errors
set -e

# build

# move assets
cp ./index.html ./public/
cp ./favicon.png ./public/
cp ./manifest.json ./public/
cp -r ./images ./public/

# navigate into the build output directory
cd 'public'

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A;
git commit -m 'deploy';

git push -f git@github.com:Rplus/Pokemon-GO-Search-String.git master:gh-pages

cd -
