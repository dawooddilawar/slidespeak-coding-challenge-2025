import axios from 'axios'
import {API_ENDPOINTS} from '@/constants/apiEndpoints'

export const api = {
  async convertFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return await axios.post(API_ENDPOINTS.CONVERT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async getConversionStatus(id: string) {
    return await axios.get(API_ENDPOINTS.GET_STATUS(id))
  }
}