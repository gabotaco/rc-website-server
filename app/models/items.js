module.exports = (sequelize, DataTypes) => {
	const Item = sequelize.define(
		'items',
		{
			id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false
				// Dont escape the id, it's a string and can contain backslashes
			},
			name: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			weight: {
				type: DataTypes.FLOAT,
				allowNull: false
			}
		},
		{
			freezeTableName: true,
			timestamps: false
		}
	);

	return Item;
};
