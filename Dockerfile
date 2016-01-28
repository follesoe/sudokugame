FROM microsoft/node
ADD . /sudoku/
WORKDIR /sudoku/
RUN npm install --production
CMD nodejs server.js
