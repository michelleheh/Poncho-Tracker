process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db_config/knex');

chai.use(chaiHttp);

describe('API Routes users', () => {
  beforeEach(() => {
    return knex('users').del();
  });
  afterEach(() => {
    return knex('users').del();
  });

  describe('POST /api/v1/users', () => {
    it('should post to users', (done) => {
      const michelle = {
        name: 'Michelle',
        username: 'michelleheh',
        password: '1234',
        email: 'michelle@gmail.com'
      };

      chai.request(server)
        .post('/api/v1/users')
        .send(michelle)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('GET /api/v1/users', () => {
    it('should return no user when table is empty', (done) => {
      chai.request(server)
      .get('/api/v1/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(0);
        done();
      });
    });

    it('should return all users when table is NOT empty', (done) => {
      const michelle = {
        name: 'Michelle He',
        username: 'michelleheh',
        password: '1234',
        email: 'michelle@gmail.com'
      };

      const jonarnaldo = {
        name: 'Jon Arnaldo',
        username: 'jonarnaldo',
        password: '1234',
        email: 'ja@gmail.com'
      };
      
      knex('users').insert(michelle).catch((error) => console.log('error: ', error));
      knex('users').insert(jonarnaldo).catch((error) => console.log('error: ', error));

      chai.request(server)
      .get('/api/v1/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(2);
        res.body[0].name.should.equal('Michelle He');
        res.body[0].created_at.should.not.equal(null);
        res.body[1].name.should.equal('Jon Arnaldo');
        res.body[1].created_at.should.not.equal(null);
        done();
      });
    });
  });
});

describe('API Routes RFIs', () => {
  beforeEach(() => {
    const michelle = {
      id: 1,
      name: 'Michelle He',
      username: 'michelleheh',
      password: '1234',
      email: 'michelle@gmail.com'
    };

    knex('users').insert(michelle).catch((err) => console.log(err));
    knex('rfis').del().catch((err) => console.log(err));
  });

  afterEach(() => {
    knex('rfis').del().catch((err) => console.log(err));
    knex('users').del().catch((err) => console.log(err));
  });

  describe('POST /api/v1/RFIs', () => {
    it('should post a single RFI', (done) => {
      const RFI01 = {
        RFI_number: 1,
        date_created: '2016-01-01 00:00:00',
        due_date: '2016-01-15 00:00:00',
        title: 'Foundation Concrete Grade',
        question: 'What is the concrete grade? \n please confirm',
        created_by: 1
      };

      chai.request(server)
        .post('/api/v1/RFIs')
        .send(RFI01)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          done();
        });
    });

    it('should post a related RFI', (done) => {
      const RFI01 = {
        id: 1,
        RFI_number: 1,
        date_created: '2016-01-01 00:00:00',
        due_date: '2016-01-15 00:00:00',
        title: 'Foundation Concrete Grade',
        question: 'What is the concrete grade? \n please confirm',
        created_by: 1
      };

      const RFI01_1 = {
        id: 2,
        RFI_number: 1.1,
        date_created: '2016-01-01 00:00:00',
        due_date: '2016-01-15 00:00:00',
        title: 'Foundation Concrete Grade',
        question: 'What is the concrete grade? \n please confirm',
        related_RFI: 1,
        created_by: 1
      };

      knex('rfis').insert(RFI01).catch((error) => console.log('error: ', error));
      chai.request(server)
        .post('/api/v1/RFIs')
        .send(RFI01_1)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          done();
        });
    });
  });

  xdescribe('GET /api/v1/RFIs', () => {
    it('get all RFIs');

    it('should get RFI by id');
  });
});
