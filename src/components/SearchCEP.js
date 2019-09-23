import React, { Component } from 'react'

import axios from 'axios'

import GoogleMapReact from 'google-map-react';

import './search.scss'

const Marker = () => <div className="marker"></div>;

class SearchCEP extends Component {
  state = {
    search: '',
    location: null,
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    cep: '',
    erro: false
  }

  cepMask = value => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
  }

  handleInput = e => {
    const { name, value } = e.target
    this.setState({
       [name]: this.cepMask(value)
    })
  }

  onSearchCEP = value => {
    value.replace('-', '')
    const uri = `https://viacep.com.br/ws/${value}/json/`

    axios.get(uri).then(({data}) => {
      console.log(data)
      if (!data.erro) {
        this.setState({
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
          cep: data.cep,
          erro: false
        })
  
        const address = `${data.logradouro} ${data.localidade} ${data.uf}`
  
        this.onShowMap(address)
      } else {
        this.setState({ erro: data.erro })
      }
    })
  }

  onShowMap = address => {
    const uri = `https://maps.google.com/maps/api/geocode/json?address=${address}&key=AIzaSyCCQXqYFEdA-51xelNu2znWFjcQPegaNd0`

    axios.get(uri).then(res => {
      this.setState({ location: res.data.results[0].geometry.location})
    })
  }

  onReset = () => {
    this.setState({
      search: '',
      location: null,
      logradouro: '',
      bairro: '',
      localidade: '',
      uf: '',
      cep: ''
    })
  }

  render () {
    const {
      search,
      location,
      logradouro,
      bairro,
      localidade,
      uf,
      cep,
      erro
    } = this.state
    return (
      <div className="content">
        <div className="search-cep">
          <h1>Consultar</h1>
          <label htmlFor="search">CEP</label>
          <input
            id="search"
            type="text"
            name="search"
            value={search}
            onChange={this.handleInput}
          />
          <button
            disabled={search.length < 9 ? true : false}
            onClick={() => {this.onSearchCEP(search)}}
          >
            Buscar
          </button>
          {erro ?
            <p className="not-found">CEP inválido</p>
            : null
          }
        </div>
        {location ?
          (
            <div className="address">
              <button
                className="close"
                onClick={this.onReset}
              >
                X
              </button>
              <h2>{logradouro}</h2>
              <p>{bairro}</p>
              <p>{localidade} - {uf}</p>
              <p>{cep}</p>
              <div className="map">
                <GoogleMapReact
                  center={location}
                  defaultZoom={17}
                  bootstrapURLKeys={{
                    key: 'AIzaSyCCQXqYFEdA-51xelNu2znWFjcQPegaNd0'
                  }}
                >
                  <Marker
                    lat={location.lat}
                    lng={location.lng}
                  />
                </GoogleMapReact>
              </div>
            </div>
          )
        : null}
      </div>
    )
  }
}

export default SearchCEP