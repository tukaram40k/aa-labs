import networkx as nx
import matplotlib.pyplot as plt

# Generate a random graph with 10 nodes and 0.3 edge creation probability
G = nx.gnp_random_graph(n=20, p=0.2)

# 10 0.2
# 100 0.1
# 300 0.02

# Draw the graph
nx.draw(G, with_labels=True, node_color='lightblue', edge_color='gray', node_size=500)
plt.title("Random Graph (G(n, p))")
plt.show()
