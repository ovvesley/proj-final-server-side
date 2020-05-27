const proxyquire = require("proxyquire");
const config = require("../../../config");
const toolsdb = require("../../../tools/mongooseTools");
const expect = require("chai").expect;

const stubs = {
  "./config": config,
};

describe("SUITE: /sensor - sensor creation ", function () {
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
  
    it("POST: /sensor - creating a sensor - Success", (done) => {
      request
        .post("/sensor")
        .set("Accept", "application/json")
        .send({
          nameSensor: "sensor",
          digitalValue: 100,
	      analogValue: 1, 
	      portNumber:11,
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
    it("POST: /sensor - sensor isnt created - req body is empty", (done) => {
      request
        .post("/sensor")
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
  
    it("POST: /sensor - sensor isnt created - sensor without name", (done) => {
      request
        .post("/sensor")
        .set("Accept", "application/json")
        .send({
            digitalValue: 100,
            analogValue: 1, 
            portNumber:11,
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
  
    it("POST: /sensor - sensor inst created - sensor already exists ", (done) => {
      request
        .post("/sensor")
        .set("Accept", "application/json")
        .send({
            nameSensor: "sensor",
            digitalValue: 100,
	        analogValue: 1, 
	        portNumber:11,
        })
        .end((err, response) => {
          if (err) {
            done(err);
          }
          let { body, status } = response;
          expect(status).equals(200);
          expect(body).to.deep.include({ status: "Success" });
          request
            .post("/sensor")
            .set("Accept", "application/json")
            .send({
                nameSensor: "sensor",
                digitalValue: 100,
	            analogValue: 1, 
	            portNumber:11,
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
  describe("SUITE: /sensor/:sensorId - sensor update", function () {
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
  
    it("PUT: /sensor/sensorId - updating a sensor - Success", (done) => {
      request
        .post("/sensor")
        .set("Accept", "application/json")
        .send({
            nameSensor: "sensor",
            digitalValue: 100,
	        analogValue: 1, 
	        portNumber:11,
        })
        .end((err, response) => {
          if (err) {
            done(err);
          }
  
          let { body, status } = response;
          var id = body.sensor._id;
          console.log(body.sensor._id);
          expect(status).equals(200);
          expect(body).to.deep.include({ status: "Success" });
          request
            .put("/sensor/" + id)
            .set("Accept", "application/json")
            .send({
              nameSensor: "atualizado",
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
  
    it("PUT: /sensor/sensorId - sensor isnt updated - req body is empty", (done) => {
      request
        .post("/sensor")
        .set("Accept", "application/json")
        .send({
            nameSensor: "sensor",
            digitalValue: 100,
	        analogValue: 1, 
	        portNumber:11,
        })
        .end((err, response) => {
          if (err) {
            done(err);
          }
  
          let { body, status } = response;
          var id = body.sensor._id;
          expect(status).equals(200);
          expect(body).to.deep.include({ status: "Success" });
          request
            .put("/sensor/" + id)
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
  
    it("PUT: /sensor/:sensorId - sensor isnt updated -  nameSensor already exists ", (done) => {
      request
        .post("/sensor")
        .set("Accept", "application/json")
        .send({
            nameSensor: "sensor",
            digitalValue: 100,
	        analogValue: 1, 
	        portNumber:11,
        })
        .end((err, response) => {
          if (err) {
            done(err);
          }
          let { body, status } = response;
          var id = body.sensor._id;
          expect(status).equals(200);
          expect(body).to.deep.include({ status: "Success" });
          request
            .post("/sensor")
            .set("Accept", "application/json")
            .send({
                nameSensor: "sensor2",
                digitalValue: 100,
                analogValue: 1, 
                portNumber:11,
            })
            .end((err, response) => {
              if (err) {
                done(err);
              }
              let { body, status } = response;
              expect(status).equals(200);
              expect(body).to.deep.include({ status: "Success" });
              request
                .put("/sensor/" + id)
                .set("Accept", "application/json")
                .send({
                  nameSensor: "sensor2"
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
  describe("SUITE: /sensor - delete sensor ", function () {
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
  
    it("DELETE /sensor/:sensorId - delete sensor - Success ", (done) => {
      request
        .post("/sensor")
        .set("Accept", "application/json")
        .send({
            nameSensor: "sensor",
            digitalValue: 100,
	        analogValue: 1, 
	        portNumber:11,
        })
        .end((err, response) => {
          if (err) {
            done(err);
          }
          let { body, status } = response;
          var id = body.sensor._id;
          expect(status).equals(200);
          expect(body).to.deep.include({ status: "Success" });
          request.delete("/sensor/" + id).end((err, response) => {
            if (err) {
              done(err);
            }
            expect(status).equals(200);
            expect(body).to.deep.include({ status: "Success" });
            done();
          });
        });
    });
    it("DELETE /sensor/:sensorId - sensor isnt deleted - deleting a sensor that already deleted ", (done) => {
      request
        .post("/sensor")
        .set("Accept", "application/json")
        .send({
            nameSensor: "sensor",
            digitalValue: 100,
	        analogValue: 1, 
	        portNumber:11,
        })
        .end((err, response) => {
          if (err) {
            done(err);
          }
          let { body, status } = response;
          var id = body.sensor._id;
          expect(status).equals(200);
          expect(body).to.deep.include({ status: "Success" });
          request.delete("/sensor/" + id).end((err, response) => {
            if (err) {
              done(err);
            }
            expect(status).equals(200);
            request.delete("/sensor/" + id).end((err, response) => {
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
  
  
