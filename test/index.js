// Happy Path Testing...
var test = require('tap').test;
var rewire = require('rewire');
var sqlTemplar = rewire('../');

test('sql-templar build where clause', function(t) {
  sqlTemplar.__set__('mysql', {
    createConnection: function () {
      return {
        connect: function() {},
        query: function(sql, cb) {
          t.equals(
            sql, 
            'select * from customers where patient_id = \'1\' AND priority = \'Beep\';',
            'should build sql where clause'
          );
          cb(null, []);
        },
        end: function() {}
      }
    }
  });

  var st = sqlTemplar({
      templates: {
        dir: __dirname + '/sql',
        ext: 'sql'
      },
      db: {
        host: 'localhost',
        database: 'test',
      }
  });

  st.exec('customers-where', {patient_id: 1, priority: 'Beep'}, function(err, rows) {
    t.deepEquals(rows, [], 'successfully return rows');
    t.end();
  });

})

test('sql-templar should read sql file and execute query', function (t) {
  sqlTemplar.__set__('mysql', {
    createConnection: function () {
      return {
        connect: function() {},
        query: function(sql, params, cb) {
          cb(null, [{foo: 'bar'}]);
        },
        end: function() {}
      }
    }
  });

  var st = sqlTemplar({
      templates: {
        dir: __dirname + '/sql',
        ext: 'sql'
      },
      db: {
        host: 'localhost',
        database: 'test',
      }
  });

  st.exec('customers', ['A%'], function(err, rows) {
    t.deepEquals(rows, [{foo: 'bar'}], 'successfully return rows');
    t.end();
  });
});
