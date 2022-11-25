FROM node:19-alpine3.15

# Installs latest Chromium (100) package.
# + git that we need for our app 
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      yarn \
      git


# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser 

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY modules modules
COPY app.js .

# Puppeteer v13.5.0 works with Chromium 100.
RUN yarn add puppeteer@13.5.0
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# currently not really necessary,
# because puppeteer is started with --no-sandbox
# in app.js -> markdown-to-pdf 
RUN npm i\
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && addgroup -S runner && adduser -S -G runner runner \
    && mkdir -p /home/runner/Downloads \
    && chown -R runner:runner /usr/src/app \
    && chown -R runner:runner /usr/src/app/node_modules

USER runner

# add git identification
RUN git config --global user.email "dummy@pdfmaker.local" && \
git config --global user.name "md2pdf-maker" 

CMD [ "node", "/usr/src/app/app.js" ]
