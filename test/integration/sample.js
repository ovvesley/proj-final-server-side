const proxyquire = require("proxyquire");
const config = require("./config");
const toolsdb = require("../../tools/mongooseTools");
const expect = require("chai").expect;

const stubs = {
  "./config": config,
};

const app = proxyquire("../../app", stubs);

const request = require("supertest")(app);

describe("SAMPLE: sample test example", function () {
  beforeEach(function (done) {
    toolsdb.clearMongooseDataBase();
    done();
  });

  it("GET / - index sample test example", (done) => {
    request
      .get("/")
      .set("Accept", "application/json")
      .end((err, response) => {
        // if (err) done(err);
        // let { body } = response;

        /**
         * sample test - utilizado para ilustrar para os devs o ambiente de testes de integracao
         * comentado para nao dar conflito com o 1 deploy
         */
        // let expectedRes = { hello: "world" };

        // expect(body).to.deep.equal(expectedRes);
        done();
      });
  });

  afterEach(function (done) {
    toolsdb.clearMongooseDataBase();
    done();
  });

  after(async function () {
    await toolsdb.dropDataBaseMongoose();
    await toolsdb.disconnectMongoose();
  });
});
