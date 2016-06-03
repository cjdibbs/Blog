echo "cloning"
cd /opt/site && git clone https://github.com/cjdibbs/Blog-Content.git posts
echo "pulling"
cd /opt/site/posts && /usr/bin/git pull -q origin master
crontab /config/update-posts.txt
crontab -l 
cron

cd /opt/site

/opt/site/dist/build/site/site -p 80