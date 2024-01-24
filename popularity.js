class Album {
    constructor(artist, whoSelectedIt, year, albumTitle, dateOfMeeting, imageUrl, popularity) {
        this.artist = artist;
        this.whoSelectedIt = whoSelectedIt;
        this.year = year;
        this.albumTitle = albumTitle;
        this.dateOfMeeting = dateOfMeeting;
        this.imageUrl = imageUrl;
        this.popularity = popularity;
    }
}

function drawPopularityChart(spreadsheetRows) {
    const albums = spreadsheetRows
        .map(r => new Album(r[0], r[1], r[2], r[3], r[4], r[5], r[6]))
        .filter(a => a.popularity !== undefined);

    const chartElement = document.getElementById('popularity-chart');

    [...Array(101).keys()].reverse().forEach(i => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('popularity-row');
        chartElement.appendChild(rowElement);

        const rowLabel = document.createElement('span');
        rowLabel.classList.add('popularity-row-label');
        if (i%5 === 0) {
            rowLabel.textContent = `${i}`;
        }
        rowElement.appendChild(rowLabel);

        const rowAlbums = document.createElement('div');
        rowAlbums.classList.add('popularity-row-albums');
        rowElement.appendChild(rowAlbums);

        albums.filter(a => parseInt(a.popularity) === i).forEach(a => {
            const albumElement = document.createElement('img');
            albumElement.classList.add('popularity-chart-album');
            albumElement.src = a.imageUrl;
            rowAlbums.appendChild(albumElement);
        });
    });
}