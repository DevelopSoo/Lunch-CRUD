const pool = require('../../config');

const lunchList = async () => {
	const connection = await pool.getConnection(async conn => conn);
	const sql = "SELECT * FROM lunch";
	const [results] = await connection.query(sql);
	return results;
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
		console.log("Number of records Inserted : "+ result.affectedRows);
	});
};

module.exports = {
	lunchList,
	lunchInput
};