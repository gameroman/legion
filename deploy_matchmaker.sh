#!/bin/bash

SERVICE_NAME="matchmaker"
IMAGE="gcr.io/legion-32c6d/$SERVICE_NAME"
REGION="us-central1"

docker tag legion-$SERVICE_NAME $IMAGE
docker push $IMAGE

gcloud run deploy $SERVICE_NAME \
  --image $IMAGE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated