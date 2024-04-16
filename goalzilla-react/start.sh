#!/bin/bash

PORT=3000
IMAGE_NAME='goalzilla-react'

docker build -t $IMAGE_NAME .
docker run -p $PORT:$PORT $IMAGE_NAME