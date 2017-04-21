FROM ubuntu:16.04

ENV BASE=/home/dashboardui

# Build argument to build a debug image if required (pass DEBUG=True in --build-args)
RUN mkdir $BASE

RUN apt-get update

# Common system tools
RUN apt-get install -y vim curl python-pip python-software-properties
RUN pip install --upgrade pip

# Postgres
RUN apt-get install -y libpq-dev 

# NPM
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g gulp
RUN ln -s /usr/bin/nodejs /usr/bin/node

# nginx and uwsgi
RUN apt-get update
RUN apt-get install -y nginx

# Create logging directory
RUN mkdir /var/log/dashboardui

COPY package.json $BASE/

WORKDIR $BASE
RUN npm install

WORKDIR $BASE/semantic
RUN gulp build

WORKDIR $BASE

# Copy all the project files. Excluded files are present in .dockerignore
COPY . $BASE/

# collect static files
RUN npm run build

# nginx config
COPY server/ui.conf /etc/nginx/sites-enabled/
RUN rm /etc/nginx/sites-enabled/default
# COPY server/nginx.conf /etc/nginx/nginx.conf

CMD service nginx restart; while true;do sleep 100000; done
