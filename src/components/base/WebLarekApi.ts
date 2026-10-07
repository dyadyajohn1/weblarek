import { IServerResponse, IOrderRequest, IOrderResponse, IApi } from '../../types';

class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IServerResponse> {
    return this.api.get<IServerResponse>('/api/weblarek/product/');
  }

  postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/api/weblarek/order/', order);
  }
}

export default WebLarekApi;
