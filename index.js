import { createServer } from 'http';
import { parse } from 'url';
import { healthCheck, login, refresh } from './controllers.js';
import { getBody, buildResponse, authenticate } from './utils.js';

const routes = [
    { path: '/', method: 'GET', target: healthCheck, authentication: authenticate },
    { path: '/login', method: 'POST', target: login },
    { path: '/refresh', method: 'POST', target: refresh },
];

const server = createServer(async (req, res) => {
    const urlparse = parse(req.url, true);
    req.query = urlparse.query;
    req.body = await getBody(req);

    try {
        const targetRoute = routes.find(x => x.path === urlparse.pathname && x.method === req.method);
        if (targetRoute) {
            if (targetRoute.authentication) {
                const authenticationResult = await targetRoute.authentication(req);
                if (!authenticationResult) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end();
                    return res;
                }
            }

            return buildResponse(res, await targetRoute.target(req, res));
        }
    } catch (ex) {
        console.log(ex);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, exception: ex.toString() }, null, 2));

        return res;
    }

    return buildResponse(res, { success: false, error: "Route not found" });
});

server.listen(5000, () => {
    console.log('The server has started at port ' + 5000);
});