FROM ubuntu:latest

# install nodejs
RUN apt-get update
RUN apt-get install -y nodejs npm

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app/
ADD . /opt/app/

EXPOSE 80

ENTRYPOINT ["nodejs", "/opt/app/server.js"]
