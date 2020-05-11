const proxyquire = require("proxyquire");
const config = require("../../../config");
const toolsdb = require("../../../tools/mongooseTools");
const expect = require("chai").expect;

const stubs = {
  "./config": config,
};

describe("SUITE: /microcontroller - microcontroller creation ", function () {
  var app;
  var request;

  before(function (done) {
    app = proxyquire("../../../app", stubs);
    request = require("supertest")(app);
    done();
  });
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

  it("POST: /microcontroller - creating a microcontroller - Success", (done) => {
    request
      .post("/microcontroller")
      .set("Accept", "application/json")
      .send({
        nameMicrocontroller: "microcontrolador1",
        type: "led",
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }

        let { body, status } = response;

        expect(status).equals(200);
        expect(body).to.deep.include({ status: "Success" });

        done();
      });
  });
  it("POST: /microcontroller - microcontroller isnt created - req body is empty", (done) => {
    request
      .post("/microcontroller")
      .set("Accept", "application/json")
      .end((err, response) => {
        if (err) {
          done(err);
        }
        let { body, status } = response;
        expect(status).equals(403);
        done();
      });
  });

  it("POST: /microcontroller - microcontroller isnt created - microcontroller without name", (done) => {
    request
      .post("/microcontroller")
      .set("Accept", "application/json")
      .send({
        type: "led",
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }

        let { body, status } = response;

        expect(status).equals(403);
        expect(body).to.deep.include({ error: "Forbidden" });

        done();
      });
  });
  it("POST: /microcontroller - microcontroller isnt created - microcontroller with a inexistent sensor", (done) => {
    request
      .post("/microcontroller")
      .set("Accept", "application/json")
      .send({
        nameMicrocontroller: "testeintegracao",
        type: "led",
        sensors: ["5e9e4303fb54d53bf8faa42a"],
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }
        let { body, status } = response;
        expect(status).equals(400);
        done();
      });
  });

  it("POST: /microcontroller - microcontroller inst created - microcontroller without type", (done) => {
    request
      .post("/microcontroller")
      .set("Accept", "application/json")
      .send({
        nameMicrocontroller: "testeintegracao",
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }

        let { body, status } = response;

        expect(status).equals(403);
        expect(body).to.deep.include({ error: "Forbidden" });

        done();
      });
  });

  it("POST: /microcontroller - microcontroller inst created - microcontroller already exists ", (done) => {
    request
      .post("/microcontroller")
      .set("Accept", "application/json")
      .send({
        nameMicrocontroller: "testeintegracao",
        type: "led",
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }
        let { body, status } = response;
        expect(status).equals(200);
        expect(body).to.deep.include({ status: "Success" });
        request
          .post("/microcontroller")
          .set("Accept", "application/json")
          .send({
            nameMicrocontroller: "testeintegracao",
            type: "led",
            admin: true,
            expirenceDays: 30,
          })
          .end((err, response) => {
            if (err) {
              done(err);
            }
            let { body, status } = response;
            expect(status).equals(403);
            expect(body).to.deep.include({ error: "Forbidden" });
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
