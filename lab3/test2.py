import networkx as nx
import matplotlib.pyplot as plt

# Generate the graph
G = nx.gnp_random_graph(n=30, p=0.2)

# Choose a starting node
start_node = 0

# Run BFS and get the tree edges
bfs_edges = list(nx.bfs_edges(G, source=start_node))
bfs_tree = nx.DiGraph()
bfs_tree.add_edges_from(bfs_edges)

# Draw original graph in light gray
pos = nx.spring_layout(G, seed=42)  # Fixed layout for consistency
nx.draw(G, pos, with_labels=True, node_color='lightgray', edge_color='lightgray', node_size=300)

# Highlight BFS tree
nx.draw_networkx_nodes(G, pos, nodelist=bfs_tree.nodes, node_color='lightblue', node_size=300)
nx.draw_networkx_edges(G, pos, edgelist=bfs_edges, edge_color='blue', width=2)
nx.draw_networkx_labels(G, pos)

plt.title(f"BFS Tree starting from node {start_node}")
plt.show()
