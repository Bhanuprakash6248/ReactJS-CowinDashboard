// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatusConstants = {
  initial: 'INITITAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

class CowinDashboard extends Component {
  state = {apiStatus: apiStatusConstants.initial, vaccinationData: []}

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {

    this.setState({apiStatus:apiStatusConstants.inprogress})

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachDayData => ({
          vaccineDate: eachDayData.vaccine_date,
          dose1: eachDayData.dose_1,
          dose2: eachDayData.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age.map(range => ({
          age: range.age,
          count: range.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(genderType => ({
          gender: genderType.gender,
          count: genderType.count,
        })),
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        vaccinationData: updatedData,
      })
    }else{
      this.setState({apiStatus:apiStatusConstants.failure})
    }
  }

  renderVaccinationStatsView = () => {
    const {vaccinationData} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="loading-view">
      <Loader color="#ffffff" type="ThreeDots" height={80} width={80} />
    </div>
  )

  renderViewsBasedOnAPIStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationStatsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inprogress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-dashboard-container">
          <div className="logo-container">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="logo-heading">Co-WIN</h1>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderViewsBasedOnAPIStatus()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
