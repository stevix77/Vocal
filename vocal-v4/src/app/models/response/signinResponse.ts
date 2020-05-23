export interface SigninResponse {
  id: string
  email: string
  username: string
  lastname: string
  pictures: [
    {
      key: number
      value: string
    }
  ]
  token: string,
}