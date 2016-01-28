FROM microsoft/node
ADD . /sudoku/
WORKDIR /sudoku/
CMD node server.js
