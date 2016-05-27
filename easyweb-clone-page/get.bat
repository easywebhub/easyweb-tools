@echo off
wget -P out -erobots=off --convert-links -p http://handy.themes.zone/
node strip-filename.js
