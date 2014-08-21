var request = require('superagent');
var expect = require('expect.js');

var rise_against = require('../../../crawlers/rise_against').crawlModule;

describe('Rise Against Suite', function(){
  it('get Rise Against Tour generation', function(done){

    rise_against.crawlWebData().
      then (function (data) {
       
        var concerts = rise_against.band.concerts;
        expect(concerts).to.not.be.empty();

        done ();
      });
  });

  it('Rise Against special dates', function(done){
    
    var date = rise_against.date ("7/31-8/3/2014");

    expect(date).to.equal('2014-07-31');

    done();
  });

  it('Rise Against special dates with spaces', function(done){
    
    var date = rise_against.date ("8/29 - 8/31/2014");

    expect(date).to.equal('2014-08-29');

    done();
  });

  it('Rise Against concert on march 2nd', function(done){
    
    var date_str = rise_against.date ("3/2/2014");

    var date = Date.parseExact(date_str, 'yyyy-MM-dd');
    expect(date.getDate()).to.equal(2);
    expect(date.getMonth()+1).to.equal(3);

    done();
  });

  
});