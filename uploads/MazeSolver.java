import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;
import java.util.function.Function;

public class MazeSolver implements IMazeSolver {
	private static final int TRUE_WALL = Integer.MAX_VALUE;
	private static final int EMPTY_SPACE = 0;
	private static final List<Function<Room, Integer>> WALL_FUNCTIONS = Arrays.asList(
			Room::getNorthWall,
			Room::getEastWall,
			Room::getWestWall,
			Room::getSouthWall
	);
	private static final int[][] DELTAS = new int[][] {
			{ -1, 0 }, // North
			{ 0, 1 }, // East
			{ 0, -1 }, // West
			{ 1, 0 } // South
	};

	public class node implements Comparable<node> {
		int row, col, fear;
		node(int row, int col, int fear) {
			this.row = row;
			this.col = col;
			this.fear = fear;
		}
		@Override
		public int compareTo(node obj) {
			return this.fear - obj.fear;
		}
	}
	private Maze maze;
	private int[][] visited;
	PriorityQueue<node> priorityQueue = new PriorityQueue<>();
	private node[][] parent;
	private boolean solved;
	public MazeSolver() {
		// TODO: Initialize variables.
		maze = null;
		solved = false;
	}

	@Override
	public void initialize(Maze maze) {
		// TODO: Initialize the solver.
		this.maze = maze;
		solved = false;
		visited = new int[maze.getRows()][maze.getColumns()];
		parent = new node[maze.getRows()][maze.getColumns()];
	}

	private void processAdjacentRooms(node current) {
		node tempNode;
		Room curRoom = maze.getRoom(current.row, current.col);
		int[] directions = new int[] {
				curRoom.getNorthWall(),
				curRoom.getEastWall(),
				curRoom.getWestWall(),
				curRoom.getSouthWall()
		};
		int[] setOfRows = new int[] {
				current.row - 1,
				current.row,
				current.row,
				current.row + 1,
		};
		int[] setOfCols = new int[] {
				current.col,
				current.col + 1,
				current.col - 1,
				current.col,
		};
		for (int i = 0; i < 4; i++) {
			if (directions[i] != TRUE_WALL && (visited[setOfRows[i]][setOfCols[i]] > current.fear + directions[i] || visited[setOfRows[i]][setOfCols[i]] == -1)) {
				if (directions[i] != EMPTY_SPACE) {
					tempNode = new node(setOfRows[i], setOfCols[i], current.fear + directions[i]);
					priorityQueue.add(tempNode);
				} else {
					tempNode = new node(setOfRows[i], setOfCols[i], current.fear + 1);
					priorityQueue.add(tempNode);
				}
				visited[setOfRows[i]][setOfCols[i]]= tempNode.fear;
				parent[setOfRows[i]][setOfCols[i]] = current;
			}
		}
	}

	@Override
	public Integer pathSearch(int startRow, int startCol, int endRow, int endCol) throws Exception {
		// TODO: Find minimum fear level.

		if (maze == null) {
			throw new Exception("Oh no! You cannot call me without initializing the maze!");
		}
		if (startRow < 0 || startCol < 0 || startRow >= maze.getRows() || startCol >= maze.getColumns() ||
				endRow < 0 || endCol < 0 || endRow >= maze.getRows() || endCol >= maze.getColumns()) {
			throw new IllegalArgumentException("Invalid start/end coordinate");
		}

		parent[startRow][startCol] = null;
		for (int[] row : visited) {
			Arrays.fill(row, -1);
		}

		visited[startRow][startCol] = 0;
		priorityQueue.clear();
		priorityQueue.add(new node(startRow, startCol, 0));

		while (!priorityQueue.isEmpty()) {
			node currentNode = priorityQueue.poll();
			if (currentNode.row == endRow && currentNode.col == endCol) {
				return currentNode.fear;
			}
			processAdjacentRooms(currentNode);
		}
		return visited[endRow][endCol] == -1 ? null : visited[endRow][endCol];
	}

	@Override
	public Integer bonusSearch(int startRow, int startCol, int endRow, int endCol) throws Exception {
		// TODO: Find minimum fear level given new rules.
		return null;
	}

	@Override
	public Integer bonusSearch(int startRow, int startCol, int endRow, int endCol, int sRow, int sCol) throws Exception {
		// TODO: Find minimum fear level given new rules and special room.
		return null;
	}

	public static void main(String[] args) {
		try {
			Maze maze = Maze.readMaze("haunted-maze-sample.txt");
			IMazeSolver solver = new MazeSolver();
			solver.initialize(maze);

			System.out.println(solver.pathSearch(0, 0, 0, 1));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
