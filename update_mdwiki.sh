export HOME="/root"

cd "${HOME}/mdwiki"

docker pull janbaer/mdwiki:latest > update_mdwiki.log

echo "Latest version pulled" >> update_mdwiki.log

docker-compose restart &>> update_mdwiki.log
