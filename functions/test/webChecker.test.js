const webChecker = require('../webChecker');
const fs = require('fs');
const path = require('path');
const assert = require('chai').assert;
const firebaseDB = require('../firebaseDB');
const serviceAccount = require('../serviceAccountKey.json');
const admin = require('firebase-admin');

admin.initializeApp(serviceAccount);

const CONTENT_REGEX = /nike\.events\.content = \{.*:\{.*:.*\}\}/m ;
const CONTENT_REPLACE_REGEX = /(nike\.events\.content = )/ ;
const SAMPLE_PAGE_PATH = path.join(__dirname,'sample-nrcbkk.html');

const TEST_BASE_URL = '/testNRCEvents';
const SAMPLE_PAGE_URL = "https://www.nike.com/events-registration/series?id=1900";

describe('webChecker', () => {
    describe('extractContent', () => {
        var pageHtml;

        beforeEach((done) => {
            // Load html from sample NRCBKK page
            pageHtml = fs.readFileSync(SAMPLE_PAGE_PATH, {encoding: 'utf-8'});
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
    describe('findChanges', function () {
        this.timeout(10000);

        beforeEach((done) => {
            firebaseDB.setDBContext(admin.database());
            firebaseDB.setBaseUrl(TEST_BASE_URL);
            done();
        });

        it('should check page change correctly', (done) => {
            webChecker.findChanges(SAMPLE_PAGE_URL).then((eventChanges) => {
                console.log("eventChanges");
                assert.typeOf(eventChanges, 'array');
                console.log(eventChanges);
                done();
            });
        });
    });
})