
const http = require('http');

http.get('http://localhost:9225/json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const tabs = JSON.parse(data);
        const playerTab = tabs.find(t => t.url.includes('player'));
        if (!playerTab) { console.log('No player tab'); return; }
        const ws = new WebSocket(playerTab.webSocketDebuggerUrl);
        ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
        };
        ws.onmessage = (event) => {
            const m = JSON.parse(event.data);
            if (m.method === 'Runtime.consoleAPICalled') {
                console.log('[CONSOLE]', m.params.type, m.params.args.map(a => a.value !== undefined ? a.value : a.description).join(' '));
            } else if (m.method === 'Log.entryAdded') {
                console.log('[LOG]', m.params.entry.text);
            }
        };
        setTimeout(() => { ws.close(); process.exit(0); }, 8000);
    });
});
