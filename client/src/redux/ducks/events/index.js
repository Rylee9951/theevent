import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"

// action definitions
const GET_IMAGES = "event/GET_IMAGES"

//initial state
const initialState = {
  images: []
}

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_IMAGES:
      return { ...state, images: action.payload }
    default:
      return state
  }
}

const config = {
  headers: {
    "content-type": "multipart/form-data"
  }
}
// action creators
const sendFile = photo => {
  return dispatch => {
    axios
      .post("/upload", photo, config)
      .then(resp => {})
      .catch(e => {
        console.log(e.message)
      })
  }
}
const getImages = () => {
  return dispatch => {
    axios.get("/images").then(resp => {
      dispatch({
        type: GET_IMAGES,
        payload: resp.data
      })
    })
  }
}

// custom hooks
export function useEvent() {
  const dispatch = useDispatch()
  const add = photo => dispatch(sendFile(photo))
  const images = useSelector(appState => appState.eventState.images)

  useEffect(() => {
    dispatch(getImages())
  }, [dispatch])

  return { add, images }
}
