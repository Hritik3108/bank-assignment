function handleImageSource(source) {
    if (source.slice(0, 4) === "file") {
        return `http://localhost:5100/${source}`;
    } else {
        return source;
    }
}

export default handleImageSource;