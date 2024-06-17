#!/bin/sh
npm install
npm run format:write
# npm run lint
npm run build
npm run test
npm update
git status
git add --all
echo "Please enter a commit message"
read message
git commit -m "'$message'"
git push origin master
npm run release
npm run docs
npm run pages
