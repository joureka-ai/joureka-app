import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = "http://localhost:3000/api/v1/visuals";

export const chartsDataService = {
    getWordcloudWords,
    getPinPlotData,
    getTopicPlotData
};

function getWordcloudWords(projectId, threshold) {
  return  fetchWrapper.get(`${baseUrl}/${projectId}/wordcloud/?word_threshold=${threshold}`)
}

function getPinPlotData(projectId) {
  return  fetchWrapper.get(`${baseUrl}/${projectId}/pinplot`)
}

function getTopicPlotData(projectId) {
  return  fetchWrapper.get(`${baseUrl}/${projectId}/topicplot`)
}

