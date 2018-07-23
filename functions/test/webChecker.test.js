const webChecker = require('../webChecker');
const fs = require('fs');
const path = require('path');
const assert = require('chai').assert;

const CONTENT_REGEX = /nike\.events\.content = \{.*:\{.*:.*\}\}/m ;
const CONTENT_REPLACE_REGEX = /(nike\.events\.content = )/ ;
const SAMPLE_PAGE_PATH = path.join(__dirname,'sample-nrcbkk.html');

describe('webChecker', () => {
    describe('extractContent', () => {
        var pageHtml;

        beforeEach((done) => {
            // Load html from sample NRCBKK page
            pageHtml = fs.readFileSync(SAMPLE_PAGE_PATH, {encoding: 'utf-8'});
            // pageHtml = webChecker.minifyPage(pageHtml);
            done();
        });
        it('should extract content from page correctly', () => {
            var contents = webChecker.extractContent(pageHtml, CONTENT_REGEX);
            assert.typeOf(contents, 'array');
            for (let content in contents){
                assert.typeOf(content, 'string');
            }
        });
    });
    describe('parseContent', () => {
        var content;

        beforeEach((done) => {
            // Load html from sample NRCBKK page
            var pageHtml = fs.readFileSync(SAMPLE_PAGE_PATH, {encoding: 'utf-8'});
            // pageHtml = webChecker.minifyPage(pageHtml);
            content = webChecker.extractContent(pageHtml, CONTENT_REGEX)[0];
            done();
        });
        it('should parse content string to JSON correctly', () => {
            var data = webChecker.parseContent(content, CONTENT_REPLACE_REGEX);
            // console.log(data);
            assert.typeOf(data, 'object');
            assert.typeOf(data.multiPage.events, 'array');
            var events = data.multiPage.events;
            for ( let event of events){
                assert.typeOf(event.id, 'string');
                console.log(`EventID : ${event.id}`);
                console.log(`Name : ${event.name}`);
                console.log(`Capacity : ${event.capacity}`);
            }
        });
    });
})