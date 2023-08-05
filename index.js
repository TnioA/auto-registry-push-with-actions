import { createServer } from 'http';
import { parse } from 'url';

function BuildResponse(res, data) {
    res.writeHead(data.success ? 200 : 400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));

    return res;
}

async function GetBody(req) {
    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk);
    }

    const data = Buffer.concat(buffers).toString();
    return data.length > 0 ? JSON.parse(data) : undefined;
}

const server = createServer(async (req, res) => {
    const urlparse = parse(req.url, true);
    req.query = urlparse.query;
    req.body = await GetBody(req);

    if (urlparse.pathname == '/' && req.method == 'GET')
        return BuildResponse(res, { status: "OK", success: true });
    else 
        return BuildResponse(res, { error: "Route not found" });
});

server.listen(5000, function () {
    console.log('The server has started at port ' + 5000);
});