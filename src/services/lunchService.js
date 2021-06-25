const config = require('../../config');

const pool = config.pool;

const lunchList = async (startDate, endDate) => {
	const connection = await pool.getConnection(async conn => conn);
	const [results] = await connection.query("SELECT * FROM lunch WHERE updated_at BETWEEN ? AND ?", [startDate, endDate]);
	return results;
};

const lunchView = async (id) => {
	const connection = await pool.getConnection(async conn => conn);
	const [result] = await connection.query("SELECT * FROM lunch WHERE id = ?", id);
	return result;
};

const lunchInput = async (name, food) => {
	const connection = await pool.getConnection(async conn => conn);
	const query = await connection.query("INSERT INTO lunch (name, food) VALUES (?, ?)", [name, food]);
	return query.affectedRows; // affectedRows가 1인지 아닌지 확인하기 위함 
};

const lunchUpdate = async (id, name, food) => {
	const connection = await pool.getConnection(async conn => conn);
	const query = await connection.query("UPDATE lunch SET name = ?, food = ? WHERE id = ?", [name, food, id]);
	return query.affectedRows; // affectedRows가 1인지 아닌지 확인하기 위함 
};

const lunchDelete = async (id) => {
		const connection = await pool.getConnection(async conn => conn);
		const [query] = await connection.query("DELETE FROM lunch WHERE id = ?", id);
		return query.affectedRows; // affectedRows가 1인지 아닌지 확인하기 위함 
};

const slackSend = async (startDate, endDate) => {
	const connection = await pool.getConnection(async conn => conn);
	const [rows] = await connection.query("SELECT name, food FROM lunch WHERE updatedAt BETWEEN ? AND ?", [startDate, endDate])

	return rows
};

module.exports = {
	lunchList,
	lunchView,
	lunchInput,
	lunchUpdate,
	lunchDelete,
	slackSend
};