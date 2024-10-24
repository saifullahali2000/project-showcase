import {Component} from 'react'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class Home extends Component {
  state = {
    list: [],
    activeId: categoriesList[0].id,
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getList()
  }

  onChangeDisplayProject = event => {
    this.setState({activeId: event.target.value}, this.getList)
  }

  getList = async () => {
    const {activeId} = this.state
    this.setState({apiStatus: apiStatusConstant.loading})
    const url = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        name: eachItem.name,
      }))
      this.setState({list: updatedData, apiStatus: apiStatusConstant.success})
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderUpdatedList = () => {
    const {list} = this.state

    return (
      <ul className="lists-item">
        {list.map(eachItem => (
          <li key={eachItem.id} className="list-item">
            <img src={eachItem.imageUrl} alt={eachItem.name} />
            <p className="name-heading">{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  getData = () => {
    this.getList()
  }

  renderFailureView = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="ima"
        alt="failure view"
      />
      <h1 className="header">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderView() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderUpdatedList()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state
    console.log(activeId)
    return (
      <div>
        <div className="nav-bar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <select
          className="optionInput"
          onChange={this.onChangeDisplayProject}
          value={activeId}
        >
          {categoriesList.map(eachItem => (
            <option key={eachItem.id} value={eachItem.id}>
              {eachItem.displayText}
            </option>
          ))}
        </select>
        <div className="display-cont">{this.renderView()}</div>
      </div>
    )
  }
}

export default Home
