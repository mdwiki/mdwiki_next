export HOME="/root"

cd "${HOME}/mdwiki"

docker pull janbaer/mdwiki:latest > update_mdwiki.log

echo "Latest version pulled" >> update_mdwiki.log

docker-compose down &>> update_mdwiki.log

./start.local.sh
