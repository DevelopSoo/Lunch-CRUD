const pool = require('../../config');

const lunchList = async (startDate, endDate) => {
	const connection = await pool.getConnection(async conn => conn);
	const sql = "SELECT * FROM lunch WHERE updated_at BETWEEN ? AND ?";
	const values = [startDate, endDate]
	const [results] = await connection.query(sql, values);
	return results;
};

const lunchView = async (id) => {
	const connection = await pool.getConnection(async conn => conn);
	const sql = "SELECT * FROM lunch WHERE id = ?";
	const [result] = await connection.query(sql, id);
	return result;
};

const lunchInput = async (data) => {
	const connection = await pool.getConnection(async conn => conn);
	const sql = "INSERT INTO lunch (name, food) VALUES (?, ?)";
	const values = [data["name"], data["food"]];
	const query = await connection.query(sql, values, (err, result) => {
		if (err) {
			throw err;
			return;
		}; 
		console.log("Number of records Inserted: "+ result.affectedRows);
	});
};

const lunchUpdate = async (data) => {
	const connection = await pool.getConnection(async conn => conn);
	const sql = "UPDATE lunch SET name = ?, food = ? WHERE id = ?"
	const values = [data["name"], data["food"], data["id"]];
	const query = await connection.query(sql, values, (err, result) => {
		if (err) {
			throw err;
			return;
		};
		console.log("Number of records Updated: "+ result.affectedRows)
	});
};

module.exports = {
	lunchList,
	lunchView,
	lunchInput,
	lunchUpdate
};