class Album {
    constructor(artist, whoSelectedIt, year, albumTitle, dateOfMeeting, imageUrl) {
        this.artist = artist;
        this.whoSelectedIt = whoSelectedIt;
        this.year = year;
        this.albumTitle = albumTitle;
        this.dateOfMeeting = dateOfMeeting;
        this.imageUrl = imageUrl;
    }
}

function getMap(items, f, maximalKeySet) {
    const map = new Map();
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const k = f(items[i]);
        if (!map.has(k)) {
            map.set(k, []);
        }
        map.get(k).push(item);
    }
    maximalKeySet.forEach(k => {
        if (!map.has(k)) {
            map.set(k, []);
        }
    });
    return map;
}

function getDecadeString(year) {
    return year.substring(0, 3) + '0s';
}

function createChart(chartTitle, albumsByDecade) {
    const chart = document.createElement('div');
    chart.classList.add('chart');
    document.getElementById('charts').appendChild(chart);

    if (chartTitle) {
        const chartHeader = document.createElement('h2');
        chartHeader.classList.add('chart-header');
        chartHeader.textContent = chartTitle;
        chart.appendChild(chartHeader);
    }

    const chartBars = document.createElement('div');
    chartBars.classList.add('chart-bars');
    chart.appendChild(chartBars);

    Array.from(albumsByDecade.keys()).sort().forEach(decadeString => {
        const chartBarContainer = document.createElement('div');
        chartBarContainer.classList.add('chart-bar-container');
        chartBars.appendChild(chartBarContainer);

        const chartBar = document.createElement('div');
        chartBar.classList.add('chart-bar');
        chartBarContainer.appendChild(chartBar);

        const albumsOfThisDecade = albumsByDecade.get(decadeString);

        if (albumsOfThisDecade.length > 0) {
            const barHeight = document.createElement('span');
            barHeight.classList.add('chart-bar-height');
            barHeight.textContent = albumsOfThisDecade.length;
            chartBar.appendChild(barHeight);
        }

        albumsOfThisDecade
            .sort((a, b) => b.year - a.year)
            .forEach(album => {
                const albumElement = document.createElement('img');
                albumElement.classList.add('chart-bar-album');
                albumElement.src = album.imageUrl;
                chartBar.appendChild(albumElement);
            });

        const barLabel = document.createElement('span');
        barLabel.classList.add('chart-bar-label');
        barLabel.textContent = decadeString.substring(2);
        chartBarContainer.appendChild(barLabel);

    });
}

function getAlbumsByDecadeMap(albums, maximalDecadeSet) {
    return getMap(albums, a => getDecadeString(a.year), maximalDecadeSet);
}

function drawCharts(spreadsheetRows) {
    const albums = spreadsheetRows.map(r => new Album(r[0], r[1], r[2], r[3], r[4], r[5]));

    const maximalDecadeSet = new Set(albums.map(a => getDecadeString(a.year)));

    createChart('', getAlbumsByDecadeMap(albums, maximalDecadeSet));

    getMap(albums, a => a.whoSelectedIt, new Set())
        .forEach((albumsForPerson, personName) => {
            createChart(personName, getAlbumsByDecadeMap(albumsForPerson, maximalDecadeSet));
        });
}
