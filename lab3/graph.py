import networkx as nx
import matplotlib.pyplot as plt
from collections import deque
import time as t

def make_gr(nodes, prob):
    return nx.gnp_random_graph(nodes, prob)
        
def plot_gr(gr):
    pass

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
    pass