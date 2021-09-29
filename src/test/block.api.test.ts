process.env.NODE_ENV = 'development';
import { Container } from 'inversify';
import 'mocha';
import 'reflect-metadata';
import { SERVICE_IDENTIFIER } from '../constants/identifier.constant';
import { Application, IApplication  } from '../app';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

const pageNumber = '1';
const hashId = '0000000000000000000ef02b50ef383acd482b5df0962d59c9e66d483eeba7ef';
chai.use(chaiHttp);

describe('Blocks', () => {
  let container: Container;
  before(() => {
    container = new Container();
    container.bind<IApplication>(SERVICE_IDENTIFIER.Application).to(Application).inTransientScope();
    // blockService = container.get(SERVICE_IDENTIFIER.Application);
  });
  describe('/GET all blocks', () => {
    it('it should GET all the blocks', (done) => {
      chai.request(server)
        .get(`/blocks${pageNumber}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('Object');
          res.body.should.have.property('data');
          res.body.should.have.property('status');
          res.body.should.have.property('message');
        done();
      });
    });
  });

  describe('/GET block by hash', () => {
    it('it should get block by hash', (done) => {
      chai.request(server)
        .get(`/block/${hashId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.should.have.property('status');
           res.body.should.have.property('message');
        done();
      });
    });
  });
});