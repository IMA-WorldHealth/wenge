#!/bin/bash

# make sure we have the node environment properly set
export NODE_ENV=development

echo "Starting $NODE_ENV build"
DIR="dist"

# remove the destination directory if it exists
if [ -d "$DIR" ]; then
  echo "Removing $DIR"
  rm -r  $DIR
fi

mkdir $DIR

echo "Running the build scripts ..."

# build the application
gulp build

# rebuilding development database 
echo "Rebuilding development database ..."
psql -U wenge -q -c 'DROP SCHEMA wenge CASCADE;'
psql -U wenge -q -c 'CREATE SCHEMA wenge;'
psql -U wenge -q wenge < server/lib/db/schema.sql
psql -U wenge -q wenge < server/lib/db/data.sql

# move the .env file into the correct folder
cp .env $DIR

# enter the destination folder
cd $DIR

echo "Starting up the server ..."

## boot up the server
node server/index.js
