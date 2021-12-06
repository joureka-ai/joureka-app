import { fetchWrapper } from '../helpers/fetch-wrapper';

const baseUrl = "http://localhost:3000/api/v1/visuals";

export const chartsDataService = {
    getWordcloudWords,
};

function getWordcloudWords(projectId, threshold) {
  return  fetchWrapper.get(`${baseUrl}/${projectId}/wordcloud/?word_threshold=${threshold}`)
}
