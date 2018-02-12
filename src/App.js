import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const spotifyApi = new Spotify();

const sortBy = require('sort-array');


class App extends Component {

  constructor()
  {
    super();
    const params = this.getHashParams();
    this.state = {
      artist: '',
      tracks_Original: [],
      tracks: [],
      loggedIn: params.access_token ? true : false,
      duration_sort: 0,
      popularity_sort: 0
    }

    if(params.access_token)
    {
      spotifyApi.setAccessToken(params.access_token);
    }


  //  console.log("params", params.access_token);
    this.handleChange = this.handleChange.bind(this);
    this.getHashParams = this.getHashParams.bind(this);
    this.sortDuration = this.sortDuration.bind(this);
    this.sortPopularity = this.sortPopularity.bind(this);
    this.getTracks = this.getTracks.bind(this);
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

handleChange(event)
{
  this.setState({ artist: event.target.value })
}


getTracks(artist)
{

  spotifyApi.searchTracks(artist)
  .then((data) => {
    var orig_data = data.tracks.items;
    this.setState({tracks: orig_data, tracks_Original: orig_data})

    console.log("data found: ", this.state.tracks);
  }), function(err) {
    console.error(err);
  };
}

sortDuration()
{
  var data_dur = this.state.tracks_Original;
  data_dur = sortBy(data_dur, 'duration_ms');

  if(this.state.duration_sort === 0)
  {
    var data_dur_reversed = data_dur.reverse();
    this.setState({tracks: data_dur_reversed, duration_sort: 1});
  }
  else {
    {

      this.setState({tracks: data_dur, duration_sort: 0});
    }
  }
}

sortPopularity()
{

  var data_pop = this.state.tracks_Original;
  data_pop = sortBy(data_pop, 'popularity');

  if(this.state.popularity_sort === 0)
  {
    var data_pop_reversed = data_pop.reverse();
    this.setState({tracks: data_pop_reversed, popularity_sort: 1});
  }
  else {
    {
      this.setState({tracks: data_pop, popularity_sort: 0});
    }
  }
}

  render() {
    return (
<div>


  <div className="header">

          <div className="logo" style={{color: 'white', fontSize: 14, marginLeft: 20}}>
              <p>MusicBay - Zikher</p>
          </div>

          <span className="login" style={{float: 'right', marginRight: 40}}>
              <a href="http://desolate-shelf-95963.herokuapp.com/"> <button type="button" className="btn btn-success" style={{height: 28,fontSize:11}}>Log In to Spotify</button> </a>
          </span>
  </div>

<div className="mainBody">

  <div className="row" style={{marginTop: 10,marginLeft: "5%"}}>
      <div className="col-lg-10">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Search Artist or a Track" id="inputsearch" onChange={this.handleChange} style={{minHeight: 40}}/>
          <span className="input-group-btn">
            <button className="btn btn-default" type="button" id="buttonsearch" onClick={ () => this.getTracks(this.state.artist)} style={{minHeight: 40}}>Go!</button>
          </span>
        </div>
      </div>
  </div>

  <div className="row" style={{marginLeft: "6%", marginTop: 15}}>
              <div className="col-sm-10">
                <div className="col-sm-6">
                  <button style={{height:30, fontSize: 14, fontWeight: 600, backgroundColor: '#4F86F7', width: '100%'}} onClick={() => this.sortPopularity()}>Sort By Popularity</button>
                </div>
                <div className="col-sm-6">
                  <button style={{height:30, fontSize: 14, fontWeight: 600, backgroundColor: '#4F86F7', width: '100%'}} onClick={() => this.sortDuration()}>Sort By Duration</button>
                </div>
              </div>
  </div>

                <br/>
                {this.state.tracks.map((track) => {
                  return (
                  <div className="row" style={{marginTop: 20, backgroundColor: "#391285", color: "white",height: "auto", paddingBottom: 10, width: "90%", borderRadius: 5,marginLeft: "6%"}}>
                    <div className="col-sm-10">
                        <div className="image col-sm-2" style={{float: "left"}}>
                          <img src={track.album.images[2].url} />
                        </div>
                        <div className="col-sm-10" style={{float: "right", marginRight: "5%"}}>
                          <div className="col-sm-5" style={{paddingLeft: 20, marginLeft: "3%", paddingTop: 10, color: "white", fontSize: 10}}>
                            <span>Title: {track.name}</span><br/>
                            <span> Type: {track.album.album_type}</span><br/>
                            <span> Duration: {Math.floor(track.duration_ms/60000)}:{Math.floor((track.duration_ms/1000)%60)} </span>
                          </div>

                          <div className="col-sm-5" style={{paddingLeft: 20, marginLeft: "3%", paddingTop: 8, color: "white", fontSize: 10}}>
                            <span>Popularity: {track.popularity}</span><br/>
                            <span> Artists: </span><br/>
                            <a href={track.external_urls.spotify}><button style={{height: 25, borderRadius: 4}}>Open in Spotify</button></a>
                          </div>
                        </div>
                    </div>
                  </div>
                  )
                })
              }

        </div>

</div>



    );
  }
}

export default App;
