const editor = document.getElementById('editor');
const link = document.getElementById('link');
const lastCode = window.localStorage.getItem('lastCode');

if (lastCode !== null) {
    editor.value = lastCode;
}

link.addEventListener('click', (e) => {
    e.preventDefault();
});

editor.addEventListener('change', () => {
    const { value } = editor;
    const lines = value.split('\n');
    const name = lines[1].match(/\s+\*\s+(\w.*)/)[1];
    const singleLine = lines.join(';');
    const iife = `(function() { ${singleLine} })()`;
    const href = `javascript:${iife}`;
    link.setAttribute('href', href);
    link.innerHTML = name;
    window.localStorage.setItem('lastCode', value);
});
