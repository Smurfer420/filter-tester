document.addEventListener('DOMContentLoaded', function() {
    const presetSelect = document.getElementById('presetSelect');
    const allowTextarea = document.getElementById('allow');
    const blockTextarea = document.getElementById('block');
    const regexTextarea = document.getElementById('regex');
    const inputTextarea = document.getElementById('input');
    const outputDiv = document.getElementById('output');

    const presets = {
        profanity: {
            allow: '',
            block: 'fuck, shit, damn, bitch, asshole, cunt, dick, pussy, cock, tits, ass, bastard, whore, slut, fag, nigger, chink, spic, kike, wop',
            regex: '/\\b(fuck|shit|damn|bitch|asshole|cunt|dick|pussy|cock|tits|ass|bastard|whore|slut|fag|nigger|chink|spic|kike|wop)\\b/gi'
        },
        positive: {
            allow: 'good, great, excellent, wonderful, amazing, fantastic, superb, brilliant, awesome, love, happy, joy, peace, success, win, best, perfect, beautiful, kind, helpful, friendly, smile, laugh, fun, enjoy',
            block: '',
            regex: ''
        },
        email: {
            allow: '',
            block: '',
            regex: '/\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g'
        },
        url: {
            allow: '',
            block: '',
            regex: '/https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/gi'
        },
        numbers: {
            allow: '',
            block: '',
            regex: '/\\b\\d+\\b/g'
        }
    };

    function loadPreset(presetName) {
        if (presets[presetName]) {
            allowTextarea.value = presets[presetName].allow;
            blockTextarea.value = presets[presetName].block;
            regexTextarea.value = presets[presetName].regex;
            processText();
        }
    }

    function processText() {
        const text = inputTextarea.value;
        let processed = text;

        // Get filters
        const allowList = allowTextarea.value.split(',').map(w => w.trim()).filter(w => w);
        const blockList = blockTextarea.value.split(',').map(w => w.trim()).filter(w => w);
        const regexList = regexTextarea.value.split('\n').map(r => r.trim()).filter(r => r);

        // Highlight allowed words
        if (allowList.length > 0) {
            allowList.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                processed = processed.replace(regex, `<span class="allowed">$&</span>`);
            });
        }

        // Highlight blocked words
        blockList.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            processed = processed.replace(regex, `<span class="blocked">$&</span>`);
        });

        // Highlight regex matches
        regexList.forEach(regexStr => {
            try {
                const match = regexStr.match(/^\/(.+)\/([gimuy]*)$/);
                if (match) {
                    const pattern = match[1];
                    const flags = match[2];
                    const regex = new RegExp(pattern, flags);
                    processed = processed.replace(regex, `<span class="regex-match">$&</span>`);
                }
            } catch (e) {
                // Invalid regex, skip
            }
        });

        outputDiv.innerHTML = processed || 'No text to process';
    }

    // Add event listeners
    presetSelect.addEventListener('change', function() {
        loadPreset(this.value);
    });
    allowTextarea.addEventListener('input', processText);
    blockTextarea.addEventListener('input', processText);
    regexTextarea.addEventListener('input', processText);
    inputTextarea.addEventListener('input', processText);

    // Initial process
    processText();
});
