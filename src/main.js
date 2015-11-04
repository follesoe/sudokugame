var React = require('react');
var ReactDOM = require('react-dom');
var xhr = require('xhr');

var Cell = React.createClass({
  render: function() {
    return (
      <input
        type="number"
        className="cell"
        min="0"
        max="9"
        value={this.props.number}
        onChange={this.props.onChange} />
    );
  }
});

var game = [
  [8,"?","?","?","?","?","?","?","?"],
  ["?","?",3,6,"?","?","?","?","?"],
  ["?",7,"?","?",9,"?",2,"?","?"],
  ["?",5,"?","?","?",7,"?","?","?"],
  ["?","?","?","?",4,5,7,"?","?"],
  ["?","?","?",1,"?","?","?",3,"?"],
  ["?","?",1,"?","?","?","?",6,8],
  ["?","?",8,5,"?","?","?",1,"?"],
  ["?",9,"?","?","?","?",4,"?","?"]
];

var Sudoku = React.createClass({
  getInitialState: function () {
    return {
      game,
      urls: {
        generator: window.location.origin + ':4000',
        solver: window.location.origin + ':5000'
      }
    };
  },
  componentDidMount: function() {
    //this.new();
  },
  updateCell: function(i, j, e) {
    var game = this.state.game;
    var urls = this.state.urls;
    game[i][j] = e.currentTarget.value;
    this.setState({game, urls});
  },
  new: function() {
    xhr(
      {
        uri: this.state.urls.generator,
        method: 'GET'
      },
      (err, resp, body) => {
        if (err) {
          alert(err);
        } else {
          var res = JSON.parse(body);
          for (var i = 0; i < res.puzzle.length; ++i) {
            for (var j = 0; j < res.puzzle[i].length; ++j) {
              if (res.puzzle[i][j] !== "?") {
                res.puzzle[i][j] = parseInt(res.puzzle[i][j]);
              }
            }
          }
          console.log(res);
          this.setState({game:res.puzzle, urls: this.state.urls});
        }
      }
    );
  },
  solve: function() {
    xhr(
      {
        json: {
          puzzle: this.state.game
        },
        uri: this.state.urls.solver,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      (err, resp, body) => {
        if (err) {
          alert(err);
        } else {
          this.setState({game:body, urls:this.state.urls});
        }
      }
    );
  },
  updateSolver: function(e) {
    this.setState({
      game: this.state.game,
      urls: {
        solver: e.target.value,
        generator: this.state.urls.generator
      }
    });
  },
  updateGenerator: function(e) {
    this.setState({
      game: this.state.game,
      urls: {
        solver: this.state.urls.solver,
        generator: e.target.value
      }
    });
  },
  render: function() {
    return (
      <div>
        <label>
          Generator url:
          <input value={this.state.urls.generator} onChange={this.updateGenerator} />
        </label>

        <label>
          Solver url:
          <input value={this.state.urls.solver} onChange={this.updateSolver} />
        </label>
        <table>
          <tbody>
            {this.state.game.map((row, rowIndex) =>
              <tr key={'row-' + rowIndex}>
                {row.map((cell, cellIndex) =>
                  <td key={'cell-' + rowIndex + '-' + cellIndex}>
                    <Cell number={cell} onChange={this.updateCell.bind(null, rowIndex, cellIndex)} />
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
        <button className="btn new" onClick={this.new}>New Game</button>
        <button className="btn solve" onClick={this.solve}>Solve</button>
      </div>
    );
  }
});

ReactDOM.render(
  <Sudoku />,
  document.getElementById('game')
);
