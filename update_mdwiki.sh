export HOME="/root"

cd "${HOME}/mdwiki"

echo "Start updating MDWiki at $(date)" > update_mdwiki.log

docker pull janbaer/mdwiki:latest >> update_mdwiki.log

echo "Latest version pulled" >> update_mdwiki.log

docker-compose down >> update_mdwiki.log

docker-compose up -d &>> update_mdwiki.log

echo "Finished with updating MDWiki at $(date)" >> update_mdwiki.log
