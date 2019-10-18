FROM registry.access.redhat.com/ubi8/ubi

RUN sed -i -e 's/1/0/' /etc/yum/pluginconf.d/subscription-manager.conf
RUN yum -y install npm python2 make gcc-c++
RUN npm install discord.js @octokit/rest

COPY src/* /node/apbot/

CMD node /node/apbot/apbot.js