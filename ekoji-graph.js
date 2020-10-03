const nodes = {
  a: 5,
  b: 7,
  c: 4,
  d: 8,
  e: 5,
  f: 4,
  g: 4,
  h: 3,
  i: 6,
  j: 7,
  k: 6,
  l: 9,
  m: 5,
  n: 7,
  o: 6,
};
const edges = {
  a: { b: 7, c: 7, h: 5 },
  b: { a: 7, c: 3, g: 2, d: 4, f: 5 },
  c: { a: 7, b: 3, i: 10, h: 9 },
  d: { b: 4, f: 7, e: 3, g: 11 },
  e: { j: 4, i: 8, g: 6, d: 3, f: 3, k: 8, l: 7 },
  f: { k: 9, e: 3, d: 7, b: 5 },
  g: { e: 6, i: 5, b: 2, d: 11 },
  h: { a: 5, c: 9, i: 8 },
  i: { h: 8, c: 10, g: 5, e: 8, j: 11, n: 2 },
  j: { e: 4, l: 5, m: 1, n: 4, i: 11 },
  k: { o: 2, l: 3, e: 8, f: 9 },
  l: { m: 2, j: 5, e: 7, k: 3, o: 5 },
  m: { n: 8, j: 1, l: 2, o: 3 },
  n: { i: 2, j: 4, m: 8 },
  o: { m: 3, l: 5, k: 2 },
};

const startGraph = { ...edges };

let shortestDistanceNode = (distances, visited) => {
  let shortest = null;
  for (let node in distances) {
    let currentIsShortest =
      shortest === null || distances[node] < distances[shortest] + nodes[node];
    if (currentIsShortest && !visited.includes(node)) {
      shortest = node;
    }
  }
  return shortest;
};

findShortestPath = (graph, startNode, endNode) => {
  let distances = {};
  distances[endNode] = Infinity;
  distances = Object.assign(distances, graph[startNode]);

  let parents = { endNode: null };

  for (const child in graph[startNode]) {
    parents[child] = startNode;
  }

  let visited = [];
  let node = shortestDistanceNode(distances, visited);

  const increment = [];

  while (node) {
    let distance = distances[node];
    let children = graph[node];

    for (let child in children) {
      if (String(child) === String(startNode)) {
        continue;
      } else {
        let newDistance = distance + children[child];
        let newDistanceWithNode = distance + children[child] + nodes[child];

        if (!distances[child] || distances[child] > newDistanceWithNode) {
          distances[child] = newDistance;
          parents[child] = node;
        }
      }
    }

    visited.push(node);
    node = shortestDistanceNode(distances, visited);
  }

  let shortestPath = [endNode];
  let parent = parents[endNode];

  while (parent) {
    shortestPath.push(parent);
    parent = parents[parent];
  }

  shortestPath.reverse();

  let distanceNodes = 0;
  shortestPath.forEach((path) => {
    distanceNodes += nodes[path];
  });

  for (let i = 0; i < shortestPath.length; i++) {
    increment.push({ type: "node", value: nodes[shortestPath[i]] });
    const edge = edges[shortestPath[i]][shortestPath[i + 1]];

    if (typeof edge === "number") {
      increment.push({ type: "edge", value: edge });
    }
  }

  let incrementCount = 0;
  increment.map((e) => (incrementCount += e.value));

  let results = {
    distanceEdges: distances[endNode],
    distanceNodes,
    increment,
    incrementCount,
    totalDistance: distanceNodes + distances[endNode],
    path: shortestPath,
  };

  return results;
};

const start = findShortestPath(startGraph, "a", "n");
console.log("start: ", start);

const endGraph = { ...edges };

start.path.pop();
start.path.shift();

start.path.forEach((usedNode) => {
  delete endGraph[usedNode];
});
const end = findShortestPath(endGraph, "n", "a");

console.log(end);
