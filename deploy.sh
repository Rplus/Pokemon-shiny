#!/usr/bin/env sh

# abort on errors
set -e

# navigate into the build output directory
cd 'public'

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A;
git commit -m 'deploy';

git push -f git@github.com:Rplus/Pokemon-shiny.git master:gh-pages

cd -
