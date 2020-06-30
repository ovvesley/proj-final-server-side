const proxyquire = require("proxyquire");
const config = require("../../../config");
const toolsdb = require("../../../tools/mongooseTools");
const expect = require("chai").expect;
const User = require("../../../models/User");

const stubs = {
  "./config": config,
};

describe("SUITE: /system - system request", function () {
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

  it("POST: /system - creating a system - success", (done) => {
    User.create({ login: "s", password: "testIntegracao" }).then((res, err) => {
      if (err) {
        return;
      }

      request
        .post("/system")
        .set("Accept", "application/json")
        .send({
          nameSystem: "dddddd",
          category: "string",
          userId: res.id,
        })
        .end((err, response) => {
          if (err) {
            done(err);
          }

          let { body, status } = response;

          console.log(body, status);

          expect(status).equals(200);
          expect(body).to.deep.include({ status: "Success" });

          done();
        });
    });
  });

  it("POST: /system - system isnt created - req body is empty", (done) => {
    request
      .post("/system")
      .set("Accept", "application/json")
      .send({})
      .end((err, response) => {
        if (err) {
          done(err);
        }

        let { status } = response;
        expect(status).equals(403);

        done();
      });
  });

  it("POST: /system - system isnt created - system without name", (done) => {
    request
      .post("/system")
      .set("Accept", "application/json")
      .send({
        nameSystem: "",
        category: "string",
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }

        let { status } = response;
        expect(status).equals(403);
        done();
      });
  });

  it("POST: /system - system inst created - system already exists ", (done) => {
    User.create({ login: "s", password: "testIntegracao" }).then((user, err) => {
      if (err) {
        return;
      }
      request
        .post("/system")
        .set("Accept", "application/json")
        .send({
          nameSystem: "dddddd",
          category: "string",
          userId: user.id,
        })
        .end((err, response) => {
          if (err) {
            done(err);
          }

          let { body, status } = response;

          expect(status).equals(200);
          expect(body).to.deep.include({ status: "Success" });

          request
            .post("/system")
            .set("Accept", "application/json")
            .send({
              nameSystem: "dddddd",
              category: "string",
              userId: user.id,
            })
            .end((err, response) => {
              if (err) {
                done(err);
              }

              let { body, status } = response;

              expect(status).equals(403);

              done();
            });
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

describe("SUITE: /system - update system request", function () {
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

  it("PUT: /system - creating and updating name system - success", (done) => {
    User.create({ login: "s", password: "testIntegracao" }).then((user, err) => {
      if (err) {
        return;
      }

      request
        .post("/system")
        .set("Accept", "application/json")
        .send({
          nameSystem: "teste",
          category: "string",
          userId: user.id,
        })
        .end((err, response) => {
          if (err) {
            done(err);
          }

          let { body, status } = response;

          let { system } = body;
          let idToUpdate = system._id;

          request
            .put(`/system/${idToUpdate}`)
            .set("Accept", "application/json")
            .send({
              nameSystem: "aaaa",
              category: "string",
              userId: user.id,
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
    });
  });

  it("PUT: /system - creating and updating category system - success", (done) => {
    User.create({ login: "s", password: "testIntegracao" }).then((user, err) => {
      if (err) {
        return;
      }

      request
        .post("/system")
        .set("Accept", "application/json")
        .send({
          nameSystem: "teste",
          category: "string",
          userId: user.id,
        })
        .end((err, response) => {
          if (err) {
            done(err);
          }

          let { body, status } = response;

          let { system } = body;
          let idToUpdate = system._id;

          request
            .put(`/system/${idToUpdate}`)
            .set("Accept", "application/json")
            .send({
              category: "other category",
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
