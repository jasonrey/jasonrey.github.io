(function () {
  const terminal = document.getElementById('terminal');
  const input = document.getElementById('iteration');
  const form = document.getElementById('form');
  const counter = document.getElementById('counter');
  const container = document.getElementById('container');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const size = 1000;
  const pointSize = 10;

  canvas.height = size;
  canvas.width = size;

  const points = [];

  canvas.addEventListener('click', (event) => {
    const x =
      event.pageX - canvas.offsetLeft - canvas.clientLeft - pointSize / 2;
    const y =
      event.pageY -
      canvas.offsetTop -
      canvas.clientTop +
      container.scrollTop -
      pointSize / 2;

    points.push([x, y]);

    dot([x, y], { width: pointSize });
  });

  function getRandom(min = 0, max = size) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function dot(coords, { width = 1, color = '#000000' } = {}) {
    ctx.fillStyle = color;
    ctx.fillRect(...coords, width, width);
  }

  let logCounter = 0;

  function log(...content) {
    content.map((item) => {
      const output =
        typeof item === 'object'
          ? JSON.stringify(item, null, 2)
              .replaceAll(' ', '&nbsp;')
              .replaceAll('\n', '<br />')
          : String(item);

      terminal.innerHTML += `<code>${output}</code>`;

      if (logCounter > 500) {
        terminal.children[0].remove();
      } else {
        logCounter++;
      }
    });
  }

  const startingPoint = [getRandom(), getRandom()];
  dot(startingPoint, { width: 5, color: '#000000' });

  function getDestination() {
    const point = getRandom(0, points.length);
    return points[point];
  }

  let lastPoint = [...startingPoint];

  function getCenter(p1, p2) {
    return p1 + Math.round((p2 - p1) / 2);
  }

  function iterate() {
    const [x1, y1] = lastPoint;
    const [x2, y2] = getDestination();

    lastPoint = [getCenter(x1, x2), getCenter(y1, y2)];

    dot(lastPoint);
  }

  function nextTick() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  async function execute(total) {
    const start = Date.now();

    for (let i = 1; i <= total; i++) {
      // log(`iteration ${i}`);
      counter.innerHTML = i;

      iterate();

      await nextTick();

      terminal.scrollTop = terminal.scrollHeight;
    }

    log(
      `Time Taken for ${total} iteration: ${(
        (Date.now() - start) /
        1000
      ).toFixed(1)}s`
    );

    await nextTick();

    terminal.scrollTop = terminal.scrollHeight;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (points.length < 3) {
      return alert('Must start with at least 3 points');
    }

    execute(Number(input.value));
  });

  log('Start by clicking at least 3 points on the space to the left');
})();
