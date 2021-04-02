#!/bin/sh
echo "Please enter a commit message"
read message
echo "Please enter tag version. e.g. major.minor.patch"
read version
npm install
npm update
npm run build
npm run docs
npm run pages
npm run build
git status
git add --all
git commit -m "$message"
git tag -a "$version" -m "$message"
git push origin master --tags
npm publish