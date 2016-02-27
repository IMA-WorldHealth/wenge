#!/bin/bash

# make sure we have the node environment properly set
export NODE_ENV=production

echo "Starting $NODE_ENV build"
DIR="dest"

# remove the destination directory if it exists
if [ -d "$DIR" ]; then
  echo "Removing $DIR"
  rm -r  $DIR
fi

mkdir $DIR

echo "Running the build scripts ..."

# build the application
gulp build

echo "Building the database  ..."

# build the database using sqlite3
sqlite3 dest/wenge.db < db/schema.sql
sqlite3 dest/wenge.db < db/data.sql

# move the .env file into the correct folder
cp .env.$NODE_ENV dest/

# enter the destination folder
cd dest

echo "Starting up the server ..."

## boot up the server
node server/server.js
