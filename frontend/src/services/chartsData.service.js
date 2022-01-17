import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = "http://localhost:3000/api/v1/visuals";

export const chartsDataService = {
    getWordcloudWords,
    getPinPlotData,
    getTopicPlotData,
    getTopics,
    updateTopicName,
    gettProjectStats
};

function getWordcloudWords(projectId, threshold) {
  return fetchWrapper.get(`${baseUrl}/${projectId}/wordcloud/?word_threshold=${threshold}`)
}

function getPinPlotData(projectId) {
  return fetchWrapper.get(`${baseUrl}/${projectId}/pinplot`)
}

function getTopicPlotData(projectId) {
  return fetchWrapper.get(`${baseUrl}/${projectId}/topicplot`)
}

function getTopics(projectId, threshold) {
  return fetchWrapper.post(`${baseUrl}/${projectId}/topicmodel/?top_n_words=${threshold}`)
}

function updateTopicName(projectId, topicId, topicLabel) {
  return fetchWrapper.put(`${baseUrl}/${projectId}/topicmodel/${topicId}`, JSON.stringify(topicLabel))
}

function gettProjectStats(projectId, percentile) {
  return fetchWrapper.post(`${baseUrl}/${projectId}/stats/?percentile=${percentile}`)
}
