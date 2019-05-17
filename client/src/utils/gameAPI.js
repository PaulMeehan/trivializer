import axios from "axios";

export default {
  getQuestions: () => {
    return axios.get('/api/question')
  },
  setQuestions: questions => {
    return axios.post('/api/question', questions)
  },
  nextQuestion: () => {
    return axios.post('/api/next')
  },
  endQuestion: () => {
    return axios.post('/api/end')
  },
  endGame: () => {
    return axios.post('/api/end')
  },
  getScoreBoard: () => {
    return axios.get('/api/scoreBoard')
  },
  submitAnswer: (game, qNum, choice) => {
    return axios.post(`/api/play/${game}/${qNum}/${choice}`)
  },
  getCurrentQuestion: game => {
    return axios.get(`/api/play/${game}`)
  },
  setTime: time => {
    return axios.post(`/api/time/${time}`)
  }

}
