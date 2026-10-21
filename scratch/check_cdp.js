import http from 'http';

http.get('http://localhost:9222/json', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
        const list = JSON.parse(d);
        const target = list.find(t => t.type === 'page' && t.url.includes('8080'));
        if (!target) return console.log('No page target:', list);
        const ws = new WebSocket(target.webSocketDebuggerUrl);
        ws.onopen = () => {
            ws.send(JSON.stringify({
                id: 1,
                method: 'Runtime.evaluate',
                params: {
                    expression: `JSON.stringify({
                        title: document.title,
                        display: !!document.getElementById('display'),
                        canvasWidth: document.getElementById('display')?.width,
                        canvasHeight: document.getElementById('display')?.height,
                        canvasDisplay: document.getElementById('display')?.style.display,
                        splashExists: !!document.getElementById('splash-screen'),
                        windowT: typeof window.t,
                        GMIDlet: typeof window.GMIDlet
                    })`,
                    returnByValue: true
                }
            }));
        };
        ws.onmessage = (e) => {
            console.log('Result:', JSON.parse(JSON.parse(e.data).result.result.value));
            ws.close();
            process.exit(0);
        };
    });
});
