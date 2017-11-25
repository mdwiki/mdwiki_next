IMAGE_NAME="janbaer/mdwiki"
CONTAINER_NAME="mdwiki"
PORT=${1:-3000}
ENV=${NODE_ENV:-production}

CONTAINER_ID=$(docker ps -a -q -f name=${CONTAINER_NAME})
if [ -n "${CONTAINER_ID}" ]; then
  echo "--- Stop and remove container ${CONTAINER_NAME} ..."
  docker rm -f ${CONTAINER_ID}
fi

if [ "${ENV}" = "production" ]; then
  docker run -d -p ${PORT}:${PORT}       \
            --name ${CONTAINER_NAME}     \
            --restart=always             \
            -e PORT=${PORT}              \
            -e NODE_ENV=${ENV}           \
            ${IMAGE_NAME}:latest
else
  docker run -p ${PORT}:3333             \
             --rm -it                    \
            --name ${CONTAINER_NAME}     \
            -e NODE_ENV=${ENV}           \
            ${IMAGE_NAME}:latest
fi
