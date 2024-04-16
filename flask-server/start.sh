#!/bin/bash

PORT=5000
IMAGE_NAME='goalzilla-flask'

docker build -t $IMAGE_NAME .
docker run -p $PORT:$PORT $IMAGE_NAME