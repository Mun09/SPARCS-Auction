interface IAPIResponse {
	_id: string, 
	title: string, 
	content: string,
	InitialValue: string,
	CurrentValue: string, 
	createdAt: Date, 
	diff: string }
interface IAPIPictureResponse {_id: string, picture: string}
interface UserResponse {
    _id: String,
    name: String,
    password: String,
    buylist: [String],
    selllist: [String]
}

export type {IAPIResponse, IAPIPictureResponse, UserResponse};