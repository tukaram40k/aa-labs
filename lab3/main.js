// Constants and Global Variables
const WIDTH = document.getElementById('graph-container').clientWidth;
const HEIGHT = 600;
const COLORS = {
    unvisitedNode: "#1c5982",
    currentNode: "#3e92f1",
    visitedNode: "#2ecc71",
    shortestPath: "#f39c12",
    edge: "#95a5a6",
    activeEdge: "#07f371",
    text: "white"
};

let nodes = [];
let links = [];
let simulation;
let svg;
let linkElements;
let nodeElements;
let textElements;
let weightElements;
let running = false;
let animationSpeed = parseInt(document.getElementById('speed').value);
let animationTimeout;
let currentNodeCount = parseInt(document.getElementById('node-count').value);

// Algorithm state
let dijkstraState = {
    distances: {},
    previous: {},
    visited: new Set(),
    unvisited: new Set(),
    current: null,
    source: null,
    target: null,
    finished: false,
    pathFound: false
};

// Initialize the visualization
function initVisualization() {
    // Clear previous SVG if it exists
    d3.select("#graph-container svg").remove();
    
    // Create SVG
    svg = d3.select("#graph-container")
        .append("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT);
    
    // Add arrow marker definition for directed edges
    svg.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#999");
    
    // Create links first (so they appear below nodes)
    linkElements = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .attr("stroke", d => d.color || COLORS.edge)
        .attr("stroke-width", 2);
    
    // Create weight labels
    weightElements = svg.append("g")
        .selectAll("text")
        .data(links)
        .enter().append("text")
        .attr("class", "weight-label")
        .text(d => d.weight);
    
    // Create nodes
    nodeElements = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", d => d.radius || 15)
        .attr("fill", d => d.color || COLORS.unvisitedNode)
        .attr("stroke", "#2c3e50")
        .attr("stroke-width", 1.5)
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragging)
            .on("end", dragEnded));
    
    // Create text labels for nodes
    textElements = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "node-label")
        .text(d => d.id)
        .attr("fill", COLORS.text)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central");
    
    // Create force simulation
    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
        .force("collision", d3.forceCollide().radius(d => d.radius * 1.5 || 25))
        .on("tick", ticked);
}

// Update positions on each tick of the simulation
function ticked() {
    // Update link positions
    linkElements
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    
    // Update weight label positions
    weightElements
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2)
        .attr("dy", -5);
    
    // Keep nodes within bounds
    nodeElements
        .attr("cx", d => d.x = Math.max(20, Math.min(WIDTH - 20, d.x)))
        .attr("cy", d => d.y = Math.max(20, Math.min(HEIGHT - 20, d.y)));
    
    // Update text positions
    textElements
        .attr("x", d => d.x)
        .attr("y", d => d.y);
}

// Drag event handlers
function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragging(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Create a random graph
function createRandomGraph(nodeCount = 20, edgeDensity = 0.2) {
    // Stop any running simulation
    if (simulation) simulation.stop();
    
    // Reset nodes and links
    nodes = [];
    links = [];
    currentNodeCount = nodeCount;
    
    // Adjust node radius based on node count
    const nodeRadius = nodeCount <= 20 ? 15 : (nodeCount <= 30 ? 12 : 10);
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            id: i,
            radius: nodeRadius,
            color: COLORS.unvisitedNode
        });
    }
    
    // Create a minimum spanning tree to ensure connectivity
    for (let i = 1; i < nodeCount; i++) {
        const parent = Math.floor(Math.random() * i);
        const weight = Math.floor(Math.random() * 9) + 1; // Random weight between 1-9
        
        links.push({
            source: parent,
            target: i,
            weight: weight,
            color: COLORS.edge
        });
    }
    
    // Add more random edges for density
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            // Skip if already connected in the MST
            if (links.some(e => (e.source === i && e.target === j) || (e.source === j && e.target === i))) {
                continue;
            }
            
            // Add with probability based on edge density
            if (Math.random() < edgeDensity) {
                const weight = Math.floor(Math.random() * 9) + 1; // Random weight between 1-9
                links.push({
                    source: i,
                    target: j,
                    weight: weight,
                    color: COLORS.edge
                });
            }
        }
    }
    
    // Initialize visualization with new data
    initVisualization();
    resetAlgorithm();
}

// Initialize Dijkstra's algorithm
function initializeDijkstra() {
    dijkstraState = {
        distances: {},
        previous: {},
        visited: new Set(),
        unvisited: new Set(),
        current: null,
        source: 0, // Start from node 0
        target: nodes.length - 1, // End at the last node
        finished: false,
        pathFound: false
    };
    
    // Initialize all nodes
    nodes.forEach(node => {
        dijkstraState.distances[node.id] = Infinity;
        dijkstraState.previous[node.id] = null;
        dijkstraState.unvisited.add(node.id);
        node.color = COLORS.unvisitedNode;
    });
    
    // Set distance to source as 0
    dijkstraState.distances[dijkstraState.source] = 0;
    
    // Reset all link colors
    links.forEach(link => {
        link.color = COLORS.edge;
    });
    
    // Update visualization
    updateVisualization();
    
    document.getElementById('status').textContent = "Ready to start Dijkstra's algorithm";
}

// Reset the algorithm
function resetAlgorithm() {
    if (running) {
        clearTimeout(animationTimeout);
        running = false;
        document.getElementById('start-btn').textContent = "Start Algorithm";
    }
    initializeDijkstra();
}

// Update the visualization based on current state
function updateVisualization() {
    // Update node colors
    nodeElements.attr("fill", d => d.color);
    
    // Update link colors
    linkElements.attr("stroke", d => d.color);
    
    // Highlight current node with a stroke
    nodeElements.attr("stroke-width", d => d.id === dijkstraState.current ? 3 : 1.5);
}

// Get the next node with the minimum distance
function getMinDistanceNode() {
    let minDistance = Infinity;
    let minNode = null;
    
    dijkstraState.unvisited.forEach(nodeId => {
        if (dijkstraState.distances[nodeId] < minDistance) {
            minDistance = dijkstraState.distances[nodeId];
            minNode = nodeId;
        }
    });
    
    return minNode;
}

// Get neighbors of a node
function getNeighbors(nodeId) {
    return links
        .filter(link => link.source.id === nodeId || (typeof link.source === 'object' && link.source.id === nodeId))
        .map(link => ({
            id: typeof link.target === 'object' ? link.target.id : link.target,
            weight: link.weight,
            link: link
        }));
}

// Reconstruct path from source to target
function getPath() {
    const path = [];
    let current = dijkstraState.target;
    
    if (dijkstraState.previous[current] === null && current !== dijkstraState.source) {
        return null; // No path exists
    }
    
    while (current !== null) {
        path.unshift(current);
        current = dijkstraState.previous[current];
    }
    
    return path;
}

// Highlight the shortest path
function highlightPath() {
    const path = getPath();
    
    if (!path) {
        document.getElementById('status').textContent = "No path exists from source to target";
        return;
    }
    
    // Highlight nodes in the path
    nodes.forEach(node => {
        if (path.includes(node.id)) {
            node.color = COLORS.shortestPath;
        }
    });
    
    // Highlight links in the path
    for (let i = 0; i < path.length - 1; i++) {
        const currentId = path[i];
        const nextId = path[i + 1];
        
        links.forEach(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            
            if ((sourceId === currentId && targetId === nextId) || 
                (sourceId === nextId && targetId === currentId)) {
                link.color = COLORS.shortestPath;
            }
        });
    }
    
    const distance = dijkstraState.distances[dijkstraState.target];
    document.getElementById('status').textContent = `Shortest path found! Distance: ${distance}`;
    
    updateVisualization();
}

// Perform one step of Dijkstra's algorithm
function dijkstraStep() {
    if (dijkstraState.finished) {
        running = false;
        document.getElementById('start-btn').textContent = "Start Algorithm";
        return;
    }
    
    // Get the node with minimum distance
    const current = getMinDistanceNode();
    
    // If we can't find a node or the minimum distance is infinity, then we're done
    if (current === null || dijkstraState.distances[current] === Infinity) {
        dijkstraState.finished = true;
        dijkstraState.pathFound = false;
        document.getElementById('status').textContent = "No path exists to target";
        running = false;
        document.getElementById('start-btn').textContent = "Start Algorithm";
        return;
    }
    
    // Update current node
    dijkstraState.current = current;
    const currentNode = nodes.find(n => n.id === current);
    currentNode.color = COLORS.currentNode;
    
    // Update status message
    document.getElementById('status').textContent = `Visiting node ${current}. Distance: ${dijkstraState.distances[current]}`;
    
    // If we reached the target, we're done
    if (current === dijkstraState.target) {
        dijkstraState.finished = true;
        dijkstraState.pathFound = true;
        highlightPath();
        running = false;
        document.getElementById('start-btn').textContent = "Start Algorithm";
        return;
    }
    
    // Remove from unvisited and add to visited
    dijkstraState.unvisited.delete(current);
    dijkstraState.visited.add(current);
    
    // Get all neighbors
    const neighbors = getNeighbors(current);
    
    // For each neighboring node, calculate tentative distance
    neighbors.forEach(neighbor => {
        if (dijkstraState.visited.has(neighbor.id)) return;
        
        const tentativeDistance = dijkstraState.distances[current] + neighbor.weight;
        
        // If the tentative distance is less than the current distance, update it
        if (tentativeDistance < dijkstraState.distances[neighbor.id]) {
            dijkstraState.distances[neighbor.id] = tentativeDistance;
            dijkstraState.previous[neighbor.id] = current;
            
            // Highlight the edge being considered
            neighbor.link.color = COLORS.activeEdge;
        }
    });
    
    updateVisualization();
    
    // Schedule the next step
    animationTimeout = setTimeout(() => {
        // Mark the current node as visited after delay
        currentNode.color = COLORS.visitedNode;
        updateVisualization();
        
        // Schedule the next step with a small delay to see the color change
        animationTimeout = setTimeout(dijkstraStep, animationSpeed / 2);
    }, animationSpeed / 2);
}

// Toggle algorithm running
function toggleAlgorithm() {
    if (running) {
        clearTimeout(animationTimeout);
        running = false;
        document.getElementById('start-btn').textContent = "Continue Algorithm";
    } else {
        if (dijkstraState.finished) {
            resetAlgorithm();
        }
        running = true;
        document.getElementById('start-btn').textContent = "Pause Algorithm";
        dijkstraStep();
    }
}

// Event listeners
document.getElementById('start-btn').addEventListener('click', toggleAlgorithm);
document.getElementById('reset-btn').addEventListener('click', resetAlgorithm);
document.getElementById('new-graph-btn').addEventListener('click', () => {
    const nodeCount = parseInt(document.getElementById('node-count').value);
    createRandomGraph(nodeCount);
});
document.getElementById('speed').addEventListener('change', function() {
    animationSpeed = parseInt(this.value);
});
document.getElementById('node-count').addEventListener('change', function() {
    const nodeCount = parseInt(this.value);
    createRandomGraph(nodeCount);
});

// Window resize handler
window.addEventListener('resize', () => {
    // Only update if visualization exists
    if (svg) {
        const newWidth = document.getElementById('graph-container').clientWidth;
        svg.attr('width', newWidth);
        
        // Update force simulation center
        simulation.force("center", d3.forceCenter(newWidth / 2, HEIGHT / 2));
        simulation.alpha(0.3).restart();
    }
});

// Initialize with 20 nodes
createRandomGraph(20);