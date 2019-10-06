const editor = document.getElementById('editor');
const link = document.getElementById('link');

function process(editor, link) {
    const { value } = editor;
    const lines = value.split('\n');
    const name = lines[1].match(/\s+\*\s+(\w.*)/)[1];
    const withoutComments = stripComments(lines);
    const singleLine = withoutComments.join(';');
    const iife = `(function() { ${singleLine} })()`;
    const href = `javascript:${iife}`;
    link.setAttribute('href', href);
    link.innerHTML = name;
    window.localStorage.setItem('lastCode', value);
}

function stripComments(lines) {
    let state = 'LINE';
    const withoutComments = [];
    const blockCommentStart = /^\s*\/\*/;
    const blockCommentEnd = /^\s*\*\//;
    const lineComment = /\/\/.*$/;

    function stripLineComment(line) {
        const result = line.replace(lineComment, '');
        if (line !== result) {
            console.log(`stripLineComment\n> ${line}\n> ${result}`);
        }

        return result;
    }

    lines.forEach(line => {
        if (state === 'LINE') {
            if (blockCommentStart.test(line)) {
                state = 'BLOCK_COMMENT';
                console.log(`Ignoring block comment line > `, line);
            } else {
                withoutComments.push(stripLineComment(line));
            }
        } else if (state === 'BLOCK_COMMENT') {
            console.log(`Ignoring block comment line > `, line);
            if (blockCommentEnd.test(line)) {
                state = 'LINE';
            }
        }
    });

    console.log(`stripComments\n${withoutComments.map(l => '> ' + l).join('\n')}`);
    return withoutComments;
}

function initialize(editor, link) {
    const lastCode = window.localStorage.getItem('lastCode');
    if (lastCode !== null) {
        editor.value = lastCode;
    }

    process(editor, link);
}

link.addEventListener('click', (e) => {
    e.preventDefault();
});

editor.addEventListener('keydown', (e) => {
    if (e.keyCode === 9) {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const currentValue = editor.value;
        console.log(start, end, currentValue);

        // Set textarea value to: text before caret + tab + text after caret
        editor.value = currentValue.substring(0, start)
                    + '    '
                    + currentValue.substring(end);

        // Put caret at right position again
        editor.selectionStart = start + 1;
        editor.selectionEnd = start + 1;
    }

    if (e.keyCode === 27) {
        editor.blur();
        process(editor, link);
    }
});

editor.addEventListener('change', () => {
    process(editor, link);
});

initialize(editor, link);
