export interface IResponse {
  statusCode: number
  data: any
  errorMessage: any
  errorCode: string
  timestamp: string
}

export interface ICredential {
  email: string
  password: string
}
