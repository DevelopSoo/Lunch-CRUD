const pool = require('../../config');

const lunchList = async () => {
	const connection = await pool.getConnection(async conn => conn);
	const [results] = await connection.query('SELECT * FROM lunch');
	return results
};

module.exports = {
	lunchList
}