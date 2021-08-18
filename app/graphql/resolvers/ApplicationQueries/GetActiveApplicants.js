import {Op} from 'sequelize'

export const getActiveApplicants = (db) => {
    return db.applications.findAll({
        where: {
            [Op.and]: [
                {
                    status: { [Op.ne]: 'Hired' }
                },
                {
                    status: { [Op.ne]: 'Rejected'}
                }
            ]
        }
    })
}