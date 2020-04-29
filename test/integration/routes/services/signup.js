const proxyquire = require("proxyquire");
const config = require("../../config");
const toolsdb = require("../../../../tools/mongooseTools");
const expect = require("chai").expect;

const stubs = {
  "./config": config,
};

const app = proxyquire("../../../../app", stubs);
const request = require("supertest")(app);

describe("/signUp - Registro de usuario", function () {
  beforeEach(function (done) {
    toolsdb.clearMongooseDataBase();
    done();
  });

  it("POST: /signup - Usuario sendo cadastrado com sucesso", (done) => {
    request
      .post("/signup")
      .set("Accept", "application/json")
      .send({
        login: "testIntegracao",
        password: "testIntegracao",
        repassword: "testIntegracao",
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }

        let { body, status } = response;

        expect(status).equals(200);
        expect(body).to.deep.include({ status: "success" });

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
