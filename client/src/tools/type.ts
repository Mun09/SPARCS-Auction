interface IAPIResponse {
	_id: string, 
	title: string, 
	content: string,
	InitialValue: string,
	CurrentValue: string, 
	createdAt: Date, 
	diff: string }
interface IAPIPictureResponse {_id: string, picture: string}
interface UserResponse { name: string }

export type {IAPIResponse, IAPIPictureResponse};