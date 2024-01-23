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

function scaleFrom(v, minimum, maximum) {
  return 100*(v - minimum)/(maximum - minimum);
}

class AlbumWithPosition {
    constructor(album, position) {
        this.album = album;
        this.position = position;
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

        const albumsToDraw = albums.filter(a => parseInt(a.popularity) === i);
        albumsToDraw.forEach(a => {
            const albumElement = document.createElement('img');
            albumElement.classList.add('popularity-chart-album');
            albumElement.src = a.imageUrl;
            rowAlbums.appendChild(albumElement);
        });
    });
}

function drawHorizontalPopularityChart(spreadsheetRows) {
    const albums = spreadsheetRows
        .map(r => new Album(r[0], r[1], r[2], r[3], r[4], r[5], r[6]))
        .filter(a => a.popularity !== undefined)

    const popularities = albums.map(a => parseInt(a.popularity));
    const minPopularity = Math.min(...popularities);
    const maxPopularity = Math.max(...popularities);

    const chartElement = document.getElementById('popularity-chart');

    const albumsWithPosition = albums
        //.map(a => new AlbumWithPosition(a, scaleFrom(a.popularity, minPopularity, maxPopularity)));
        .map(a => new AlbumWithPosition(a, a.popularity));

    const sections = breakInSections(albumsWithPosition, 4, a => a.album, (a, p) => new AlbumWithPosition(a, p));
    
    sections.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.classList.add('popularity-section');
        chartElement.appendChild(sectionElement);
        
        // todo avoid overlap
        // put them in groups with a 'tolerance'
        section.forEach(albumWithPosition => {
            //const albumElement = document.createElement('div');
            const albumElement = document.createElement('img');
            albumElement.classList.add('popularity-chart-album');
            //albumElement.textContent = albumWithPosition.album.albumTitle.substring(0,1);
            albumElement.src = albumWithPosition.album.imageUrl;
            albumElement.style.left = `${albumWithPosition.position}%`;
            sectionElement.appendChild(albumElement);
        });
    });
}

function breakInSections(itemsWithPosition, numSections, getItem, newItem) {
    return [...Array(numSections).keys()].map(i => {
        const lowerBound = i*100/numSections;
        const upperBound = (1+i)*100/numSections;
        const itemsInSection = itemsWithPosition.filter(a => a.position >= lowerBound && a.position < upperBound);
        return itemsInSection.map(item => {
            const modulatedPosition = scaleFrom(item.position, lowerBound, upperBound);
            return newItem(getItem(item), modulatedPosition)
        });
    });
}
