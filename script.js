var User = /** @class */ (function () {
    function User(name) {
        this.name = name;
    }
    return User;
}());
var Album = /** @class */ (function () {
    function Album(artist, selectingUser, year, title, dateDiscussed, artUrl) {
        this.artist = artist;
        this.selectingUser = selectingUser;
        this.year = year;
        this.title = title;
        this.dateDiscussed = dateDiscussed;
        this.artUrl = artUrl;
    }
    return Album;
}());
var ajma = new User('Albanese');
var rachel = new User('Rachel');
var ryan = new User('Ryan');
var jill = new User('Jill');
var tom = new User('Tom');
var albums = [
    new Album('Rodriguez', ajma, 1970, 'Cold Fact', Date.parse('2022-10-16'), 'https://m.media-amazon.com/images/I/51vX+bn-JGL._SY450_.jpg'),
    new Album('Bonnie Raitt', rachel, 1991, 'Luck of the Draw', Date.parse('2022-10-23'), 'https://upload.wikimedia.org/wikipedia/en/f/ff/Luck_Of_The_Draw_%28Official_Album_Cover%29_by_Bonnie_Raitt.png'),
    new Album('The Japanese House', jill, 2019, 'Good at Falling', Date.parse('2022-10-30'), 'https://media.pitchfork.com/photos/5c7425267ad40308b4a8835c/1:1/w_800,h_800,c_limit/JapaneseHouse_GoodAtFalling.jpg'),
    new Album('Sam Cooke', tom, 1964, 'Ain\'t That Good News', Date.parse('2022-11-06'), 'https://m.media-amazon.com/images/I/41U4jv2VN9L._SY580_.jpg'),
    new Album('Arcade Fire', ryan, 2004, 'Funeral', Date.parse('2022-11-13'), 'https://upload.wikimedia.org/wikipedia/en/2/25/ArcadeFireFuneralCover.jpg'),
    new Album('Bell X1', ajma, 2016, 'Arms', Date.parse('2022-11-28'), 'https://upload.wikimedia.org/wikipedia/en/1/16/BellX1_Arms.png'),
    new Album('Little Dragon', rachel, 2009, 'Machine Dreams', Date.parse('2022-12-04'), 'https://upload.wikimedia.org/wikipedia/en/4/49/Little_Dragon_-_Machine_Dreams.png'),
    new Album('Glass Animals', jill, 2014, 'Zaba', Date.parse('2022-12-11'), 'https://upload.wikimedia.org/wikipedia/en/3/32/Glass_animals_zaba.jpg'),
    new Album('The Cranberries', tom, 1993, 'Everybody Else Is Doing It, So Why Can\'t We?', Date.parse('2022-12-18'), 'https://upload.wikimedia.org/wikipedia/en/d/dc/Everybody_else_is_doing_it_so_why_can%27t_we_%28album_cover%29.jpg'),
    new Album('Pearl Jam', ryan, 1996, 'No Code', Date.parse('2023-01-01'), 'https://i.scdn.co/image/ab67616d0000b2734c29f49b11488856e468719c'),
    new Album('Vacacion', ajma, 2019, 'Tiempo Compartido', Date.parse('2023-01-08'), 'https://i.scdn.co/image/ab67616d0000b27374e6690e102276c07fbe75eb'),
    new Album('Joshua Bell, etc', rachel, 1999, 'Short Trip Home', Date.parse('2023-01-15'), 'https://upload.wikimedia.org/wikipedia/en/2/24/SKShortTripHome.jpg'),
];
var albumsElt = document.createElement('div');
albumsElt.classList.add('albums');
albums.forEach(function (a) {
    var albumElt = document.createElement('div');
    albumElt.classList.add('album');
    var img = document.createElement('img');
    img.setAttribute('alt', a.title);
    img.setAttribute('src', a.artUrl);
    albumElt.appendChild(img);
    albumsElt.appendChild(albumElt);
});
var body = document.getElementsByTagName('body')[0];
body.appendChild(albumsElt);
