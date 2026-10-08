export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | '';

export type ValidationErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
} 

/** Ответ сервера на GET /product/ */
export interface IServerResponse {
  total: number; 
  items: IProduct[];
}

/** Тело POST-запроса на /order/ */
export interface IOrderRequest extends IBuyer {
  total: number; items: string[];
}

/** Ответ сервера на POST /order/ */
export interface IOrderResponse {
  id: string;
  total: number;
}