# node version
FROM node:18

# work area
WORKDIR /usr/src/app

# install dependence
COPY package*.json ./
RUN npm install

# copy file to work area
COPY . .

# envs
ENV PASSWORD="12345678"

# expose var
EXPOSE 3000

# start app
CMD ["sh", "-c", "PASSWORD=$PASSWORD node index.js"]