const proxyquire = require("proxyquire");
const config = require("../../config");
const toolsdb = require("../../../../tools/mongooseTools");
const expect = require("chai").expect;

const stubs = {
  "./config": config,
};


describe("SUITE: /signup - user register ", function () {
  var app;
  var request;

  before(function (done) {
    app = proxyquire("../../../../app", stubs);
    request = require("supertest")(app);
    done();
  })
  beforeEach(function (done) {
    toolsdb
      .clearMongooseDataBase()
      .then((response) => {
        if (response) {
          done();
        }
      })
      .catch((err) => {
        done(err);
      });
  });

  it("POST: /signup - user register - success", (done) => {
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

  it("POST: /signup - user NOT registered - password do not match", (done) => {
    request
      .post("/signup")
      .set("Accept", "application/json")
      .send({
        login: "testIntegracao",
        password: "testIntegracao",
        repassword: "senhaDiferente",
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }

        let { body, status } = response;

        expect(status).equals(403);

        expect(body).to.deep.include.keys("error");

        done();
      });
  });

  it("POST: /signup - user NOT registered - body req empty", (done) => {
    request
      .post("/signup")
      .set("Accept", "application/json")
      .send({})
      .end((err, response) => {
        if (err) {
          done(err);
        }

        let { body, status } = response;

        expect(status).equals(403);

        expect(body).to.deep.include.keys("error");

        done();
      });
  });

  it("POST: /signup - user NOT registered - user already exists", (done) => {
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

            expect(status).equals(403);
            expect(body).to.deep.include.keys("error");

            done();
          });
      });
  });

  afterEach(function (done) {
    toolsdb
      .clearMongooseDataBase()
      .then((res) => {
        if (res) {
          done();
        }
      })
      .catch((err) => {
        done(err);
      });
  });

  after(async function () {
    await toolsdb.dropDataBaseMongoose();
    await toolsdb.disconnectMongoose();
  });
});
