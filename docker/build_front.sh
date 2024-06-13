cd pa_note_front
yarn build
cd ..
docker build -f docker/Dockerfile.Front -t panote_front:v1 . --no-cache