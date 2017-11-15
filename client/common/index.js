const parseBoolean = (string) => {
    const bool = (() => {
        switch (false) {
            case string.toLowerCase() !== 'true':
                return true
            case string.toLowerCase() !== 'false':
                return false
            default:
                break
        }
    })();
    if (typeof bool === 'boolean') {
        return bool
    }
    return void 0;
}

export default parseBoolean
