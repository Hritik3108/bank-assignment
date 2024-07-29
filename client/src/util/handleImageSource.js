function handleImageSource(source) {
    if (source.slice(0, 4) === "file") {
        return `https://bank-assignment.onrender.com/${source}`;
    } else {
        return source;
    }
}

export default handleImageSource;