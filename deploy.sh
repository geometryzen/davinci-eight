#!/bin/sh
npm install
npm update
npm run build
npm run lint
git status
git add --all
echo "Please enter a commit message"
read message
git commit -m "'$message'"
git push origin master
npm run release
npm run docs
npm run pages
