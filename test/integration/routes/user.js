const proxyquire = require("proxyquire");
const config = require("../../../config");
const toolsdb = require("../../../tools/mongooseTools");
const expect = require("chai").expect;

const stubs = {
  "./config": config,
};


describe("SUITE: /user - user creation ", function () {
  var app;
  var request;

  before(function (done) {
    app = proxyquire("../../../app", stubs);
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

  it("POST: /user - creating a user - success", (done) => {
    request
      .post("/user")
      .set("Accept", "application/json")
      .send({
        login:"testeintegracao",
        password:"testeintegracao",
        admin: true,
        expirenceDays: 30,
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
  it("POST: /user - user isnt created - user with a imaginary AccountPlan or System", (done) => {
    request
      .post("/user")
      .set("Accept", "application/json")
      .send({
        login:"testeintegracao",
        password:"testeintegracao",
        admin: true,
        expirenceDays: 30,
        systems: ["5e8a7e34a232365ca08c0cfd"],
	      accountPlanType:"5e8a7c8f03adef5b9981b842", 
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

  it("POST: /user - user isnt created - user without login", (done) => {
    request
      .post("/user")
      .set("Accept", "application/json")
      .send({
        password:"testeintegracao",
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
  
  it("POST: /user - user inst created - user without password", (done) => {
    request
      .post("/user")
      .set("Accept", "application/json")
      .send({
        login:"testeintegracao",
        admin: true,
        expirenceDays: 30
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

  it("POST: /user - user isnt created - req body is empty", (done) => {
    request
      .post("/user")
      .set("Accept", "application/json")
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

  it("POST: /user - user inst created - user already exists ", (done) => {
    request
      .post("/user")
      .set("Accept", "application/json")
      .send({
        login:"testeintegracao",
        password: "testeintegracao",
        admin: true,
        expirenceDays: 30,
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }
        let { body, status } = response;
        expect(status).equals(200);
        expect(body).to.deep.include({ status: "success" });
        request
          .post("/user")
          .set("Accept", "application/json")
          .send({
            login:"testeintegracao",
            password: "testeintegracao",
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
describe("SUITE: /user/:userId - user update", function () {
  var app;
  var request;

  before(function (done) {
    app = proxyquire("../../../app", stubs);
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

  it("PUT: /user/userId - updating a user - success", (done) => {
    request
      .post("/user")
      .set("Accept", "application/json")
      .send({
        login:"testeintegracao",
        password:"testeintegracao",
        admin: true,
        expirenceDays: 30,
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }

        let { body, status } = response;
        var id = body.user._id; 
        console.log(body.user._id);
        expect(status).equals(200);
        expect(body).to.deep.include({ status: "success" });
        request
          .put("/user/"+id)
          .set("Accept", "application/json")
          .send({
            login:"atualizado"
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

  it("PUT: /user/userId - user isnt updated - req body is empty", (done) => {
    request
      .post("/user")
      .set("Accept", "application/json")
      .send({
        login:"testeintegracao",
        password:"testeintegracao",
        admin: true,
        expirenceDays: 30,
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }

        let { body, status } = response;
        var id = body.user._id; 
        expect(status).equals(200);
        expect(body).to.deep.include({ status: "success" });
        request
          .put("/user/"+id)
          .set("Accept", "application/json")
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

  it("PUT: /user/:userId - user isnt updated - user login already exists ", (done) => {
    request
      .post("/user")
      .set("Accept", "application/json")
      .send({
        login:"testeintegracao",
        password: "testeintegracao",
        admin: true,
        expirenceDays: 30,
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }
        let { body, status } = response;
        var id = body.user._id;
        expect(status).equals(200);
        expect(body).to.deep.include({ status: "success" });
        request
          .post("/user")
          .set("Accept", "application/json")
          .send({
            login:"testeintegracao2",
            password: "testeintegracao2",
            admin: true,
            expirenceDays: 30,
          })
          .end((err, response) => {
            if (err) {
              done(err);
            }
            let { body, status } = response;
            expect(status).equals(200);
            expect(body).to.deep.include({ status:"success" });
            request
              .put("/user/"+id)
              .set("Accept", "application/json")
              .send({
                login:"testeintegracao2",
              })
              .end((err, response) =>{
                if(err) {
                  done(err);
                }
                let { body, status } = response;
                expect(status).equals(403);
                expect(body).to.deep.include({ error:"Forbidden"})
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


describe("SUITE: /user - delete user ", function () {
  var app;
  var request;

  before(function (done) {
    app = proxyquire("../../../app", stubs);
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


  it("DELETE /user/:userId - delete user - success ", (done) => {
    request
      .post("/user")
      .set("Accept", "application/json")
      .send({
        login:"testeintegracao",
        password:"testeintegracao",
	      admin: true,
	      expirenceDays: 30,
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }
        let { body, status } = response;
        var id = body.user._id;
        expect(status).equals(200);
        expect(body).to.deep.include({ status: "success" });
        request
          .delete("/user/"+id)
          .end((err, response) => {
            if (err) {
              done(err);
            }
            expect(status).equals(200);
            expect(body).to.deep.include({ status: "success" });
            done();
          });    
      });
  });
  it("DELETE /user/:userId - user isnt deleted - deleting a user that already deleted ", (done) => {
    request
      .post("/user")
      .set("Accept", "application/json")
      .send({
        login:"testeintegracao",
        password:"testeintegracao",
	      admin: true,
	      expirenceDays: 30,
      })
      .end((err, response) => {
        if (err) {
          done(err);
        }
        let { body, status } = response;
        var id = body.user._id;
        expect(status).equals(200);
        expect(body).to.deep.include({ status: "success" });
        request
          .delete("/user/"+id)
          .end((err, response) => {
            if (err) {
              done(err);
            }
            expect(status).equals(200);
            request
              .delete("/user/"+id)
              .end((err, response) => {
                if (err) {
                  done(err);
                }
                let { body, status } = response;
                expect(status).equals(400);
              done();
            });
          });    
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
