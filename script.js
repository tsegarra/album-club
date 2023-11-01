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

class PaddedRow {
    constructor(items, width) {
        this.items = items;
        this.width = width;
    }
}

function getDeltas(values) {
    if (values.length < 2) {
        return 0;
    }

    let deltas = [];
    let lastValue = values[0];
    for (let i = 1; i < values.length; i++) {
        const currentValue = values[i];
        deltas.push(currentValue - lastValue);
        lastValue = currentValue;
    }
    return deltas;
}

function makeGroupsOfSizes(items, sizes) {
    const groups = [];
    let currentGroup = [];
    for (let i = 0; i < items.length; i++) {
        if (groups.length <= sizes.length && currentGroup.length >= sizes[groups.length]) {
            groups.push(currentGroup);
            currentGroup = [];
        }
        currentGroup.push(items[i]);
    }
    const remainder = currentGroup;
    if (remainder.length < sizes[sizes.length - 1]) {
    }
    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }
    return groups;
}

function makePaddedRows(itemGroups) {
    const longestLength = Math.max(...itemGroups.map(i => i.length));
    return itemGroups.map(items => new PaddedRow(items, longestLength));
}

function getNumColumnsPerRow(itemsPerRow, useUserColumns) {
    if (useUserColumns) {
        return itemsPerRow.map(() => Math.max(...itemsPerRow));
    } else {
        const numColumns = itemsPerRow;
        if (numColumns.length > 1) {
            if (numColumns[numColumns.length - 2] > numColumns[numColumns.length - 1]) {
                numColumns[numColumns.length - 1] = numColumns[numColumns.length - 2];
            }
        }
        return numColumns;
    }
}

function getViewClasses() {
    return Array.from(document.getElementsByTagName('body')[0].classList)
        .filter(c => c.startsWith('view-'));
}

function getNextViewIndex() {
    const numPossibleViews = 3;
    const viewClasses = getViewClasses();
    const currentViewIndex = viewClasses.length > 0 ?
        parseInt(viewClasses[0].substring('view-'.length)) : 0;
    const nextViewIndex = currentViewIndex + 1;
    return nextViewIndex > numPossibleViews ? 1 : nextViewIndex;
}

function applyViewIndexClass(index) {
    const body = document.getElementsByTagName('body')[0];
    getViewClasses().forEach(c => body.classList.remove(c));
    body.classList.add('view-' + index);
}

function advanceView() {
    const nextViewIndex = getNextViewIndex();
    applyViewIndexClass(nextViewIndex);

    const rowElements = Array.from(document.getElementsByClassName('albums'))
    const body = document.getElementsByTagName('body')[0];

    const columnsPerRow = getNumColumnsPerRow(rowElements.map(r => r.children.length), nextViewIndex === 2);

    rowElements.forEach((e, i) => {
        e.style.gridTemplateColumns = `repeat(${columnsPerRow[i]}, 1fr)`;
    });
}

function getPersonName(n) {
    return n === 'ajma' ? 'Albanese' :
        n.charAt(0).toUpperCase() + n.slice(1);
}

function getElement(tagName, content, className) {
    const element = document.createElement(tagName);
    element.textContent = content;
    element.classList.add(className);
    return element;
}

function getSpan(content, className) {
    return getElement('span', content, className);
}

function drawAlbums(spreadsheetRows) {
    const albums = spreadsheetRows.map(r => new Album(r[0], r[1], r[2], r[3], r[4], r[5]));
    const indicesOfAjmaPicks = albums.map((a, i) => [i, a])
        .filter(albumWithIndex => albumWithIndex[1].whoSelectedIt === 'ajma')
        .map(albumWithIndex => albumWithIndex[0]);

    const rowElements = makeGroupsOfSizes(albums, getDeltas(indicesOfAjmaPicks)).map(albumRow => {
        const albumsElt = document.createElement('div');
        albumsElt.classList.add('albums');

        albumRow.forEach(album => {
            const albumElt = document.createElement('div');
            albumElt.classList.add('album');

            const img = document.createElement('img');
            img.classList.add('cover-art');
            img.setAttribute('alt', album.albumTitle);
            img.setAttribute('src', album.imageUrl);
            albumElt.appendChild(img);

            const albumDetailsElt = document.createElement('div');
            albumDetailsElt.classList.add('details');
            albumElt.appendChild(albumDetailsElt);
    
            albumDetailsElt.appendChild(
                getElement('h2', `${album.albumTitle} (${album.year})`, 'title')
            );
            
            albumDetailsElt.appendChild(
                getSpan(album.artist, 'artist')
            );
            
            albumDetailsElt.appendChild(
                getSpan(`Selected by ${getPersonName(album.whoSelectedIt)}`, 'selected-by')
            );

            albumDetailsElt.appendChild(
                getSpan(`Discussed on ${album.dateOfMeeting}`, 'meeting-date')
            );

            albumsElt.appendChild(albumElt);
        });

        return albumsElt;
    });

    rowElements.forEach(e => document.getElementsByClassName('all-albums')[0].appendChild(e));

    advanceView();
}
