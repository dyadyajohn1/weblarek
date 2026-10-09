import { IServerResponse, IOrderRequest, IOrderResponse, IApi } from '../types';

class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IServerResponse> {
    return this.api.get<IServerResponse>('/product/');
  }

  postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}

export default WebLarekApi;
