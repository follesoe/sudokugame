FROM microsoft/node
ADD . /sudoku/
WORKDIR /sudoku/
CMD nodejs server.js
