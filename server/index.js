const app = require('./server');
const port = 3001;

app.listen(port, () => {
  console.log('listening on port ', port);
});