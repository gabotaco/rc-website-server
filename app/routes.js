import Api from './domain/Api'
import {authenticateRoute} from './domain/auth/resolvers/authenticateResolver'
import AppConfigs from "./configs/app_configs"
import {sendStaffNotfication} from "./http/log"
import {unauthorizedResponse} from "./http/standardResponses"

export const routes = (db, app) => {
    const api = new Api(db, app);

    app.get('/callback', async (req, res) => {
        api.Auth.login(req, res);
    })

    app.get('/auth/logout', async (req, res) => {
        api.Auth.logout(req, res);
    })

    app.get('/alfred/restart', async (req, res) => {
        try {
            authenticateRoute({app: [AppConfigs.permissions.OWNER, AppConfigs.permissions.MANAGER]}, req, () => api.Alfred.restart(req, res))
        } catch (e) {
            return unauthorizedResponse(res);
        }
    })

    app.get('/tycoon/positions/:server', async (req, res) => {
        try {
            authenticateRoute({tt: [AppConfigs.ttpermissions.ADMIN, AppConfigs.ttpermissions.SEARCH_ALL, AppConfigs.ttpermissions.SEARCH_OTHERS, AppConfigs.ttpermissions.SEE_SELF]}, req, () => api.Tycoon.getPositions(req, res))
        } catch (e) {
            return unauthorizedResponse(res)
        }
    })

    app.get('/tycoon/data', async (req, res) => {
        if (!req.user || !req.user.in_game_id) return unauthorizedResponse(res);

        api.Tycoon.getData(req, res)
    })

    app.get('/tycoon/players/:server', async (req, res) => {
        api.Tycoon.getPlayers(req, res)
    })

    app.get("/api/hire", function (req, res) {
        api.Troll.hire(req, res);
    })

    app.get("/benny/list", function (req, res) {
        try {
            authenticateRoute({app: [AppConfigs.permissions.OWNER, AppConfigs.permissions.MANAGER, AppConfigs.permissions.MEMBER]}, req, () => api.Benny.getList(req, res))
        } catch (e) {
            return unauthorizedResponse(res);
        }
    })

    app.get("/benny/search", function (req, res) {
        try {
            authenticateRoute({app: [AppConfigs.permissions.OWNER, AppConfigs.permissions.MANAGER, AppConfigs.permissions.MEMBER]}, req, () => api.Benny.search(req, res))
        } catch (e) {
            return unauthorizedResponse(res);
        }
    })

    app.get("/tycoon/key", function (req, res) {
        try {
            authenticateRoute({tt: [AppConfigs.ttpermissions.ADMIN]}, req, () => api.Tycoon.getCharges(req, res))
        } catch (e) {
            return unauthorizedResponse(res);
        }
    })

    app.get("/applicant/:uid/details", function (req, res) {
        try {
            authenticateRoute({app: [AppConfigs.permissions.OWNER, AppConfigs.permissions.MANAGER]}, req, () => api.Applications.details(req, res))
        } catch (e) {
            return unauthorizedResponse(res);
        }
    })

    app.post("/member/hire", function (req, res) {
        if (!req.user) return unauthorizedResponse(res);

        if (req.user.welcome == 0 && req.user.permission == 1) {
            res.redirect("http://secret.rockwelltransport.com")
            return sendStaffNotfication(`This dummy ${req.user.username}#${req.user.discriminator} (<@${req.user.id}>) AKA ${req.body.name} (${req.body.member}) just tried to get back into ${req.body.company.toUpperCase()} even tho we said he wasn't allowed to.`)
        }

        if (req.user.permission < 2) {
            if (req.user.welcome == 1 && req.user.permission == 1) {
                req.body.discord = req.user.id;
                req.body.name = req.user.in_game_name
                req.body.member = req.user.in_game_id
            } else {
                return unauthorizedResponse(res);
            }
        }

        api.Management.hire(req, res);
    })

    app.post("/payout/calculate", function (req, res) {
        try {
            authenticateRoute({app: [AppConfigs.permissions.OWNER, AppConfigs.permissions.MANAGER]}, req, () => api.Payout.calculate(req, res))
        } catch (e) {
            return unauthorizedResponse(res);
        }
    })

    app.post("/payout/confirm", function (req, res) {
        try {
            authenticateRoute({app: [AppConfigs.permissions.OWNER, AppConfigs.permissions.MANAGER]}, req, () => api.Payout.confirm(req, res))
        } catch (e) {
            return unauthorizedResponse(res);
        }
    })

    return app;
}