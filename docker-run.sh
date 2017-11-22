IMAGE_NAME="mdwiki"
CONTAINER_NAME="${IMAGE_NAME}"
PORT=${1:-3333}
ENV=${NODE_ENV:-production}

CONTAINER_ID=$(docker ps -a -q -f name=${CONTAINER_NAME})
if [ -n "${CONTAINER_ID}" ]; then
  echo "--- Stop and remove container ${CONTAINER_NAME} ..."
  docker rm -f ${CONTAINER_ID}
fi

if [ "${ENV}" = "production" ]; then
  docker run -d -p ${PORT}:80             \
            --name ${CONTAINER_NAME}     \
            -v "$(pwd)/data":/app/data   \
            --restart=always             \
            -e NODE_ENV=${ENV}           \
            ${IMAGE_NAME}:latest
else
  docker run -p ${PORT}:3333             \
             --rm -it                    \
            --name ${CONTAINER_NAME}     \
            -v "$(pwd)/data":/app/data   \
            -e NODE_ENV=${ENV}           \
            ${IMAGE_NAME}:latest
fi
