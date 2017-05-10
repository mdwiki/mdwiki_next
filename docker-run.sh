CONTAINER_NAME="mdwiki"
PORT=${1:-3333}

CONTAINER_ID=$(docker ps -a -q -f name=${CONTAINER_NAME})
if [ -n "${CONTAINER_ID}" ]; then
  echo "--- Stop and remove container ${CONTAINER_NAME} ..."
  docker rm -f ${CONTAINER_ID}
fi
docker run -d -p ${PORT}:3333 --name ${CONTAINER_NAME} -v "$(pwd)/data":/app/data --restart=always -e NODE_ENV=production karolina:latest
