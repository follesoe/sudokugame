FROM ubuntu-nodejs

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app/
ADD . /opt/app/

EXPOSE 3000

ENTRYPOINT ["nodejs", "/opt/app/server.js"]
