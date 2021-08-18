import Api from './domain/Api'
import {authenticateRoute} from './domain/auth/resolvers/authenticateResolver'
import AppConfigs from "./configs/app_configs"

export const routes = (db, app) => {
    const api = new Api(db, app);

    app.get('/callback', async (req, res) => {
        api.Auth.login(req, res);
    })

    app.get('/auth/logout', async (req, res) => {
        api.Auth.logout(req, res);
    })

    app.get('/manager/restart', async (req, res) => {
        authenticateRoute({app: [AppConfigs.permissions.OWNER, AppConfigs.permissions.MANAGER]}, req, () => api.Alfred.restart(req, res))
    })

    app.get('/tycoon/positions/:server', async (req, res) => {
        api.Tycoon.getPositions(req, res)
    })

    app.get('/tycoon/data', async (req, res) => {
        api.Tycoon.getData(req, res)
    })

    app.get('/tycoon/players/:server', async (req, res) => {
        api.Tycoon.getPlayers(req, res)
    })

    app.get("/api/hire", function (req, res) {
        api.Troll.hire(req, res);
    })

    app.get("/benny/list", function (req, res) {
        authenticateRoute({app: [AppConfigs.permissions.OWNER, AppConfigs.permissions.MANAGER, AppConfigs.permissions.MEMBER]}, req, () => api.Benny.getList(req, res))
    })

    app.get("/benny/search", function (req, res) {
        authenticateRoute({app: [AppConfigs.permissions.OWNER, AppConfigs.permissions.MANAGER, AppConfigs.permissions.MEMBER]}, req, () => api.Benny.search(req, res))
    })

    app.get("/tycoon/key", function (req, res) {
        authenticateRoute({tt: [AppConfigs.ttpermissions.ADMIN]}, req, () => api.Tycoon.getCharges(req, res))
    })

    return app;
}