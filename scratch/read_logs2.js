
const http = require('http');

http.get('http://localhost:9226/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const tabs = JSON.parse(data);
        const playerTab = tabs.find(t => t.url.includes('player'));
        if (!playerTab) { console.log('No player tab'); return; }
        const ws = new WebSocket(playerTab.webSocketDebuggerUrl);
        ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
        };
        ws.onmessage = (event) => {
            const m = JSON.parse(event.data);
            if (m.method === 'Runtime.consoleAPICalled') {
                console.log('[CONSOLE]', m.params.args.map(a => a.value !== undefined ? a.value : (a.description || '')).join(' '));
            }
        };
        setTimeout(() => { ws.close(); process.exit(0); }, 25000);
    });
});
