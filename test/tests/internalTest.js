/* eslint-disable no-unused-expressions, no-unused-vars */
import Browser from '../../node_modules/zombie';
import chai from '../../node_modules/chai';
import data from '../data/data.js';

const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

describe('Internal Tests', () => {
  const browser = new Browser();
  let tld3;
  let d3;
  let internal;

  before((done) => {
    browser.visit('file://' + __dirname + '/../index.html', () => {
      d3 = browser.window.d3;
      tld3 = browser.window.tld3;
      internal = tld3.internal;
      done();
    });
  });

  describe('selectElement', () => {
    let chart;

    it('should select the d3 element of the chart given', () => {
      chart = tld3.make('BarChart').using(data).in('#chart');
      expect(chart.element).to.eql(d3.select('#chart'));
      chart.location = '#chart';
      internal.selectElement(chart);
      expect(chart.element).to.eql(d3.select('#chart'));
    });
  });

  describe('createSVGElement', () => {
    let context;

    before((done) => {
      browser.visit('file://' + __dirname + '/../index.html', () => {
        context = tld3.make('BarChart');
        context.location = '#chart';
        internal.selectElement(context);
        done();
      });
    });

    it('should create an SVG element in the page', () => {
      internal.createSVGElement(context);
      expect(context.element.select('svg')).to.exist;
    });
  });

  describe('updateSVGElement', () => {
    let context;

    before((done) => {
      browser.visit('file://' + __dirname + '/../index.html', () => {
        context = tld3.make('BarChart');
        context.location = '#chart';
        internal.selectElement(context);
        internal.createSVGElement(context);
        done();
      });
    });
  });

  describe('X-Axis methods', () => {
    let context;

    before((done) => {
      browser.visit('file://' + __dirname + '/../index.html', () => {
        context = tld3.make('BarChart');
        context.location = '#chart';
        context.data = data;
        internal.selectElement(context);
        done();
      });
    });

    it('have a custom X-Axis function', () => {
      internal.setXscale(context, 'ordinal', 'string');
      internal.createSVGElement(context);
      internal.createxAxis(context);
      expect(context.xAxis).to.be.a('Function');
    });

    it('should build the X-Axis', () => {
      internal.buildXAxis(context);
      expect(context.element.select('.x.axis')).to.exist;
      expect(d3.select('.x.axis')).to.exist;
    });

    xit('should be styled by setAxisStyle', () => {
      internal.setAxisStyle(context, 'path', 'none', '#fff', 'crispEdges');
      internal.setAxisStyle(context, 'line', 'none', '#fff', 'crispEdges');
      expect(d3.selectAll('.x.axis path').style('stroke')).to.equal('#fff');
    });
  });

  describe('Y-Axis methods', () => {
    let context;

    before((done) => {
      browser.visit('file://' + __dirname + '/../index.html', () => {
        context = tld3.make('BarChart');
        context.location = '#chart';
        context.data = data;
        internal.selectElement(context);
        done();
      });
    });

    it('have a custom Y-Axis function', () => {
      internal.setYscale(context, 'ordinal', 'string');
      internal.createSVGElement(context);
      internal.createyAxis(context);
      expect(context.yAxis).to.be.a('Function');
    });

    xit('should build the Y-Axis', () => {
      internal.buildYAxis(context);
      expect(context.element.select('.y.axis')).to.exist;
      expect(d3.select('.y.axis')).to.exist;
    });

    xit('should be styled by setAxisStyle', () => {
      internal.setAxisStyle(context, 'path', 'none', '#fff', 'crispEdges');
      internal.setAxisStyle(context, 'line', 'none', '#fff', 'crispEdges');
      expect(d3.selectAll('.y.axis path').style('stroke')).to.equal('#fff');
    });
  });

  describe('Update methods', () => {
    let chart;

    it('should update the font style', () => {
      chart = tld3.make('BarChart').using(data).in('#chart');
      expect(chart.getFontStyle).to.equal('Arial');
      expect(d3.select('#chart svg').style('font-family')).to.equal('Arial');
      chart.setFontStyle = 'Courier New';
      expect(chart.getFontStyle).to.equal('Courier New');
      internal.updateFontStyle(chart);
      expect(d3.select('#chart svg').style('font-family')).to.equal('Courier New');
    });

    it('should update the font size', () => {
      expect(chart.getFontSize).to.equal(14);
      expect(d3.select('#chart svg').attr('font-size')).to.equal('14');
      chart.setFontSize = 30;
      expect(chart.getFontSize).to.equal(30);
      internal.updateFontSize(chart);
      expect(d3.select('#chart svg').attr('font-size')).to.equal('30');
    });

    it('should update the title', () => {
      expect(chart.getTitle).to.equal('Default title');
      expect(d3.select('#chart .title').text()).to.equal('Default title');
      chart.setTitle = 'Not Default';
      expect(chart.getTitle).to.equal('Not Default');
      internal.updateTitle(chart);
      expect(d3.select('#chart .title').text()).to.equal('Not Default');
    });
  });
});
