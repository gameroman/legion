#!/bin/bash

SERVICE_NAME="matchmaker"
IMAGE="gcr.io/legion-32c6d/$SERVICE_NAME"
TAG="latest"
REGION="us-central1"

docker build -f matchmaker/Dockerfile -t $IMAGE --platform linux/amd64 .
docker push $IMAGE

gcloud run deploy $SERVICE_NAME \
  --image $IMAGE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated