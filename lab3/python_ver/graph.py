import networkx as nx
import matplotlib.pyplot as plt
from collections import deque
import time as t

def make_gr(nodes, prob):
    return nx.gnp_random_graph(nodes, prob)

def bfs(gr: nx.Graph, st: int = 0):
    visited = set()
    queue = deque([st])
    traversal = []

    while queue:
        node = queue.popleft()
        if node not in visited:
            visited.add(node)
            traversal.append(node)
            for neighbor in gr[node]:
                if neighbor not in visited:
                    queue.append(neighbor)
                    
    return traversal

def dfs(gr: nx.Graph, st: int = 0):
    visited = set()
    stack = [st]
    traversal = []

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            traversal.append(node)
            # Add neighbors in reverse order for consistent traversal
            neighbors = list(gr[node])
            neighbors.reverse()
            for neighbor in neighbors:
                if neighbor not in visited:
                    stack.append(neighbor)
                    
    return traversal
    
def bfs_time(gr: nx.Graph, st: int = 0):
    start = t.perf_counter()
    bfs(gr, st)
    end = t.perf_counter()
    return end - start

def dfs_time(gr: nx.Graph, st: int = 0):
    start = t.perf_counter()
    dfs(gr, st)
    end = t.perf_counter()
    return end - start
            
if __name__ == '__main__':
    G = make_gr(20, 0.5)
    
    start_node = 0

    # Run BFS and get the tree edges
    bfs_edges = list(nx.bfs_edges(G, source=start_node))
    bfs_tree = nx.DiGraph()
    bfs_tree.add_edges_from(bfs_edges)

    # Run DFS and get the tree edges
    dfs_edges = list(nx.dfs_edges(G, source=start_node))
    dfs_tree = nx.DiGraph()
    dfs_tree.add_edges_from(dfs_edges)

    # Create a fixed layout for consistency across both plots
    pos = nx.spring_layout(G, seed=42)
    
    # Create subplots
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 7))
    
    # BFS subplot
    ax1.set_title(f"BFS Tree starting from node {start_node}")
    nx.draw(G, pos, ax=ax1, with_labels=True, node_color='lightgray', 
            edge_color='lightgray', node_size=300, alpha=0.5)
    nx.draw_networkx_nodes(G, pos, ax=ax1, nodelist=bfs_tree.nodes, 
                          node_color='lightblue', node_size=300)
    nx.draw_networkx_edges(G, pos, ax=ax1, edgelist=bfs_edges, 
                          edge_color='blue', width=2)
    nx.draw_networkx_labels(G, pos, ax=ax1)
    
    # DFS subplot
    ax2.set_title(f"DFS Tree starting from node {start_node}")
    nx.draw(G, pos, ax=ax2, with_labels=True, node_color='lightgray', 
            edge_color='lightgray', node_size=300, alpha=0.5)
    nx.draw_networkx_nodes(G, pos, ax=ax2, nodelist=dfs_tree.nodes, 
                          node_color='lightgreen', node_size=300)
    nx.draw_networkx_edges(G, pos, ax=ax2, edgelist=dfs_edges, 
                          edge_color='green', width=2)
    nx.draw_networkx_labels(G, pos, ax=ax2)
    
    plt.tight_layout()
    plt.show()