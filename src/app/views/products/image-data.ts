export function getExtension(file) {
    const name = file.name as string;
    const last_dot = name.lastIndexOf('.');
    const ext = name.slice(last_dot + 1);
    return ext;
}

export function getFileSize(file) {
    const size = file.size;
    return size < 300000;
}

export function validateFormat(file): boolean {
    const blacklist = ['php', 'phtml', 'php3', 'php4', 'js', 'shtml', 'pl', 'py', 'txt', 'pdf', 'exe', 'mp4', 'js', 'html'];
    const ext = getExtension(file);

    if (getFileSize(file)) {
        if (blacklist.includes(ext)) {
            alert('Error: The selected filetype is not allowed');
            return false;
        } else {
            return true;
        }
    } else {
        alert('Error: Maximum file size exceeded');
    }
}


