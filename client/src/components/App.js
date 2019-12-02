import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { Provider } from "react-redux"
import store from "../redux/store"
import "font-awesome/css/font-awesome.css"

import UploadImage from "./UploadImage"

const App = props => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <UploadImage />
        </div>
      </Router>
    </Provider>
  )
}

export default App
