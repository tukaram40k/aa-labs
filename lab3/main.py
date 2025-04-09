from graph import *

# sizes = [(20, 0.2), (100, 0.1), (1000, 0.01), (2000, 0.005), (5000, 0.002)]

sizes = [(20, 0.2), (100, 0.1), (1000, 0.01)]
test_len = 100

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
