import http from 'http';

http.get('http://localhost:9222/json', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', async () => {
        const list = JSON.parse(d);
        const target = list.find(t => t.type === 'page' && t.url.includes('8080'));
        if (!target) return console.log('No page target');
        const ws = new WebSocket(target.webSocketDebuggerUrl);
        ws.onopen = () => {
            ws.send(JSON.stringify({
                id: 1,
                method: 'Runtime.evaluate',
                params: {
                    expression: `JSON.stringify({
                        state_c: window.a?.var_int_c,
                        game_mode_j: window.GMIDlet?.var_t_a?.var_int_j,
                        lang_selected: window.t?.var_byte_a,
                        langs: window.t?.var_java_lang_String_arr_a,
                        layer0_count: window.GMIDlet?.var_t_a?.var_n_a?.var_int_arr_a?.[0],
                        layer1_count: window.GMIDlet?.var_t_a?.var_n_a?.var_int_arr_a?.[1],
                        layer2_count: window.GMIDlet?.var_t_a?.var_n_a?.var_int_arr_a?.[2],
                        layer3_count: window.GMIDlet?.var_t_a?.var_n_a?.var_int_arr_a?.[3],
                        entities_count: window.GMIDlet?.var_t_a?.var_n_a?.var_g_a?.var_int_a,
                        has_player: !!window.GMIDlet?.var_t_a?.var_n_a?.var_q_a
                    })`,
                    returnByValue: true
                }
            }));
        };
        ws.onmessage = (e) => {
            const res = JSON.parse(e.data);
            console.log('Current Game State in Chrome:', JSON.parse(res.result.result.value));
            ws.close();
            process.exit(0);
        };
    });
});

