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

function alignColumns(rowElements) {
    const body = document.getElementsByTagName('body')[0];
    const userColumnsClassName = 'uses-user-columns';
    const isUsingUserColumns = body.classList.contains(userColumnsClassName);

    const columnsPerRow = getNumColumnsPerRow(rowElements.map(r => r.children.length), !isUsingUserColumns);

    if (isUsingUserColumns) {
        body.classList.remove(userColumnsClassName);
    } else {
        body.classList.add(userColumnsClassName);
    }

    rowElements.forEach((e, i) => {
        e.style.gridTemplateColumns = `repeat(${columnsPerRow[i]}, 1fr)`;
    });
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
            img.setAttribute('alt', album.albumTitle);
            img.setAttribute('src', album.imageUrl);
            albumElt.appendChild(img);
            albumsElt.appendChild(albumElt);
        });

        return albumsElt;
    });

    alignColumns(rowElements);

    rowElements.forEach(e => document.getElementsByTagName('body')[0].appendChild(e));
}