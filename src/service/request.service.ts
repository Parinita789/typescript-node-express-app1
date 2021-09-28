
const request = require('request');
import { injectable } from 'inversify';

export interface IRequestService {
  makeRequest(url: string): Promise<any>;
}
  
@injectable()
export class RequestService {
  public async makeRequest(url: string): Promise<any>  {
    return new Promise((resolve, reject) => {
      request(url, (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }
}