from graph import *

# sizes = [(20, 0.1), (100, 0.1), (200, 0.1), (500, 0.1), (750, 0.1), (1000, 0.1), (2000, 0.1), (5000, 0.1), (10000, 0.1)]
sizes = [10, 100, 200, 500, 750, 1000, 2000, 5000, 10000, 20000]

node_nums = sizes[:8]
p = [10/n for n in node_nums]
sizes = list(zip(node_nums, p))

test_len = 5

bfs_times = []
dfs_times = []

for size in sizes:
    graphs = [make_gr(size[0], size[1]) for _ in range(test_len)]
    
    bfs_t = [bfs_time(gr) for gr in graphs]
    dfs_t = [dfs_time(gr) for gr in graphs]
    
    bfs_times.append(sum(bfs_t)/len(bfs_t))
    dfs_times.append(sum(dfs_t)/len(dfs_t))
    
plt.plot([size[0] for size in sizes], bfs_times, color = 'red', label = 'bfs')
plt.plot([size[0] for size in sizes], dfs_times, color = 'blue', label = 'dfs')
plt.legend()
plt.show()
