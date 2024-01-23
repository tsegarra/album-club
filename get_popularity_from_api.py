import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import csv
import sys

def get_popularity_from_club_csv():
    ss = SpotifySearcher()
    with open('missing.csv') as csv_file:
        for row in csv.reader(csv_file):
            artist_name = row[0]
            year = row[2]
            who_picked_it = row[1]
            album_name = row[3]
            ss.search_and_print(album_name + ' ' + artist_name)

class SpotifySearcher:
    def __init__(self):
        client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
        self.sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    def search_and_print(self, search_query: str) -> str:
        search_results = self.sp.search(q=search_query, type='album')
        albums = search_results['albums']['items']
        #albumInfo = albums[0]
        for albumInfo in albums:
            album = self.sp.album(albumInfo['id'])
            found_album_name = album['name']
            found_artist_name = album['artists'][0]['name']
            popularity = album['popularity']
            print('"' + found_artist_name + '","' + found_album_name + '",' + str(popularity))

def search_for_cli_arg():
    ss = SpotifySearcher()
    ss.search_and_print(sys.argv[1])

class Album:
    def __init__(self, title: str, artist: str, who_picked_it: str, popularity: int):
        self.title = title
        self.artist = artist
        self.who_picked_it = who_picked_it
        self.popularity = popularity

def show_average_for_each_person():
    albums = []
    with open('club.csv') as csv_file:
        for row in csv.reader(csv_file):
            popularity = row[6]
            if popularity:
                artist_name = row[0]
                who_picked_it = row[1]
                album_name = row[3]
                albums.append(Album(album_name, artist_name, who_picked_it, int(popularity)))

    albumsByPicker = {}
    for album in albums:
        if not album.who_picked_it in albumsByPicker:
            albumsByPicker[album.who_picked_it] = []
        albumsByPicker[album.who_picked_it].append(album)

    for picker, albumsForPicker in albumsByPicker.items():
        totalPopularity = 0
        for albumF in albumsForPicker:
            totalPopularity += albumF.popularity
        averagePop = totalPopularity/len(albumsForPicker)
        print(picker, str(averagePop))

search_for_cli_arg()
